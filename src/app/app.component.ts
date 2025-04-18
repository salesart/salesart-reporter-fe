import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {RouterOutlet} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Editor, MultiRootEditor} from 'ckeditor5';
import {editorConfig} from './editor/editor-config';
import {ApiService} from './api-service';
import "ckeditor5/ckeditor5.css"
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CommonModule, NgForOf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog,} from '@angular/material/dialog';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {SharedService} from './shared-service';
import {PageSizeSelectModalData, SelectModal} from './model/select-modal';
import {EditorUtil} from './editor/editor-util';
import {Report, ReportPagePreviewProperties, ReportPageProperties, ReportPreview} from './model/report';
import {Parameter} from './model/parameter';
import {PreviewDialog} from './preview/preview-dialog';
import {ParameterTree} from './parameter-tree/parameter-tree';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {IframeMessageType} from './model/iframe-message-type';

//import {testData} from './testData' TODO for sample

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    RouterOutlet,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgForOf,
    MatInput,
    TranslateModule,
    ParameterTree],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('header') headerDiv!: ElementRef;
  @ViewChild('content') contentDiv!: ElementRef;
  @ViewChild('footer') footerDiv!: ElementRef;
  // @ts-ignore
  @ViewChild(ParameterTree) parameterTree: ParameterTree;
  private readonly defaultHeaderHeightInput = 25;
  private readonly defaultFooterHeightInput = 25;
  documentTypeList: SelectModal[] = [];
  pageSizeList = PageSizeSelectModalData;
  pdfSafeResourceUrl: SafeResourceUrl | null = null;
  previewDialog: any;
  previewData: any;
  showSpecialPageSizeField = false;
  showHeader = true;
  headerHeightInput = this.defaultHeaderHeightInput;
  showFooter = true;
  footerHeightInput = this.defaultFooterHeightInput;
  selectedPageSize: string = this.pageSizeList[0].value;
  specialPageWidth = '';
  specialPageHeight = '';
  headerTopMarginInput = 20;
  footerBottomMarginInput = 20;
  leftMarginInput = 20;
  rightMarginInput = 20;
  numberOfCopies = 1;
  editorInstance?: Editor;
  form = new FormGroup({
    id: new FormControl(),
    type: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    enabled: new FormControl()
  });
  apiUrl: string = 'http://localhost:8080/report/pdf/preview';

  constructor(private apiService: ApiService,
              private sharedService: SharedService,
              private editorUtil: EditorUtil,
              private sanitizer: DomSanitizer,
              public translate: TranslateService) {
    this.previewDialog = inject(MatDialog);
    this.translate.setDefaultLang(window.navigator.language.split("-")[0]);
    editorConfig.language = this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.sharedService.previewData$.subscribe((data) => {
      if (data === "previewClicked") {
        this.preview();
      }
    });

    window.addEventListener('message', (event: any) => {
      if (event.data.type === IframeMessageType.parameters) {
        this.parameterTree.renderParameters(event.data.parameters as Parameter[])
      } else if (event.data.type === IframeMessageType.preview_report) {
        this.renderReport(event.data.report as Report)
      } else if (event.data.type === IframeMessageType.get_report) {
        this.postReport()
      } else if (event.data.type === IframeMessageType.document_types) {
        this.documentTypeList = event.data.documentTypes
      } else if (event.data.type === IframeMessageType.preview_data) {
        this.previewData = event.data.previewData
      } else if (event.data.type === IframeMessageType.language) {
        this.changeLanguage(event.data.language);
      } else if (event.data.type === IframeMessageType.configuration) {
        this.apiUrl = event.data.previewUrl as string
      }
    }, false)
    /*
    TODO for sample
    window.postMessage(testData.parametersMessage, '*')
    window.postMessage(testData.documentTypeMessage, '*')
    window.postMessage(testData.tablePreviewMessage, '*')
    */
  }

  ngAfterViewInit() {
    this.createMultiRootCkEditor()
  }

  public renderReport(report: Report): void {
    this.form.patchValue({
      id: report.id,
      type: report.type,
      code: report.code,
      name: report.name,
      description: report.description,
      enabled: report.enabled,
    });

    this.editorInstance?.setData({
        header: report.htmlHeaderPart!,
        content: report.htmlMainPart!,
        footer: report.htmlFooterPart!
      }
    );

    if (report.pageProperties.specialPageWidth && report.pageProperties.specialPageHeight) {
      this.showSpecialPageSizeField = true
      this.specialPageHeight = report.pageProperties.specialPageHeight
      this.specialPageWidth = report.pageProperties.specialPageWidth
    } else {
      this.showSpecialPageSizeField = false
      this.selectedPageSize = report.pageProperties.size
    }
    this.headerTopMarginInput = Number(report.pageProperties.topMargin)
    this.showHeader = this.headerTopMarginInput !== undefined
    this.leftMarginInput = Number(report.pageProperties.leftMargin)
    this.rightMarginInput = Number(report.pageProperties.rightMargin)
    this.footerBottomMarginInput = Number(report.pageProperties.bottomMargin)
    this.showFooter = this.footerBottomMarginInput !== undefined
    this.headerHeightInput = Number(report.pageProperties.headerHeight)
    this.footerHeightInput = Number(report.pageProperties.footerHeight)
    this.numberOfCopies = Number(report.pageProperties.numberOfCopies)
  }

  public postReport(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      let report: Report = new Report(
        this.form.get('id')?.value!,
        this.form.get('type')?.value!,
        this.form.get('code')?.value!,
        this.form.get('name')?.value!,
        this.form.get('description')?.value!,
        this.form.get('enabled')?.value!,
        this.editorInstance?.getData({rootName: 'header'})?.toString(),
        this.editorInstance?.getData({rootName: 'content'})?.toString(),
        this.editorInstance?.getData({rootName: 'footer'})?.toString(),
        new ReportPageProperties(
          this.selectedPageSize,
          this.specialPageWidth,
          this.specialPageHeight,
          String(this.headerTopMarginInput),
          String(this.leftMarginInput),
          String(this.rightMarginInput),
          String(this.footerBottomMarginInput),
          String(this.headerHeightInput),
          String(this.footerHeightInput),
          String(this.numberOfCopies)
        )
      );

      const reportMessage = {
        "type": "report",
        "report": report
      }
      window.parent.postMessage(reportMessage, '*')
    }
  }

  public changeSpecialPageSizeSelection(event: any): void {
    this.showSpecialPageSizeField = event.checked;
    if (this.showSpecialPageSizeField) {
      this.selectedPageSize = '';
    } else {
      this.specialPageHeight = '';
      this.specialPageWidth = '';
    }
  }

  public preview(): void {
    this.apiService
      .getPdf(
        this.apiUrl,
        this.prepareReportPreview()
      )
      .subscribe({
        next: (response) => {
          this.pdfSafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(new Blob([response], {type: 'application/pdf'})));
          this.previewDialog.open(PreviewDialog, {
            width: '90vw',
            height: '90vh',
            maxWidth: '90vw',
            maxHeight: '90vh',
            data: {pdfUrl: this.pdfSafeResourceUrl},
          });
        },
        error: (error) => {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const json = JSON.parse(reader.result as string);
              const errorMessage = {
                "type": IframeMessageType.error,
                "error": json
              }
              window.parent.postMessage(errorMessage, '*')
            } catch (e) {
              console.error('Failed to parse JSON from Blob:', e);
            }
          };
          reader.readAsText(error.error);
        }
      });
  }

  changeHeaderDisplay(checked: boolean) {
    this.showHeader = checked;
    if (this.showHeader) {
      this.headerDiv.nativeElement.style.display = "block";
      this.headerHeightInput = this.defaultHeaderHeightInput;
      return;
    }
    this.headerDiv.nativeElement.style.display = "none";
    this.headerHeightInput = 0;
  }

  changeFooterDisplay(checked: boolean) {
    this.showFooter = checked;
    if (this.showFooter) {
      this.footerDiv.nativeElement.style.display = "block";
      this.footerHeightInput = this.defaultFooterHeightInput;
      return;
    }
    this.footerDiv.nativeElement.style.display = "none";
    this.footerHeightInput = 0;
  }

  onPageSizeChange(event: any) {
    this.selectedPageSize = event.value;
  }

  getPageSize(): string {
    if (this.showSpecialPageSizeField) {
      return this.specialPageWidth + 'mm ' + this.specialPageHeight + 'mm';
    } else {
      return this.selectedPageSize;
    }
  }

  prepareReportPreview(): ReportPreview {
    let htmlMainPartData: string | undefined = this.editorInstance?.getData({rootName: 'content'}).toString();
    htmlMainPartData = this.editorUtil.convertCkToFreeMarkerFormat(htmlMainPartData);

    let htmlHeaderPartData: string | undefined = this.editorInstance?.getData({rootName: 'header'}).toString();
    if (this.showHeader) {
      htmlHeaderPartData = this.editorUtil.convertCkToFreeMarkerFormat(htmlHeaderPartData);
    } else {
      htmlHeaderPartData = "";
    }

    let htmlFooterPartData: string | undefined = this.editorInstance?.getData({rootName: 'footer'}).toString();
    if (this.showFooter) {
      htmlFooterPartData = this.editorUtil.convertCkToFreeMarkerFormat(htmlFooterPartData);
    } else {
      htmlFooterPartData = "";
    }

    return new ReportPreview(
      htmlHeaderPartData,
      htmlMainPartData,
      htmlFooterPartData,
      new ReportPagePreviewProperties(
        this.getPageSize(),
        (this.headerHeightInput + this.headerTopMarginInput) + "mm",
        this.leftMarginInput + "mm",
        this.rightMarginInput + "mm",
        (this.footerHeightInput + this.footerBottomMarginInput) + "mm",
        this.headerTopMarginInput + "mm",
        this.footerBottomMarginInput + "mm"
      ),
      this.previewData
    )
  }

  changeLanguage(language: string) {
    this.translate.use(language);
    editorConfig.language = language;
    if (this.editorInstance) {
      const headerData = this.editorInstance.getData({rootName: 'header'});
      const contentData = this.editorInstance.getData({rootName: 'content'});
      const footerData = this.editorInstance.getData({rootName: 'footer'});
      this.editorInstance.destroy()
        .then(() => {
          const toolbarElement = document.querySelector('#toolbar');
          if (toolbarElement) {
            toolbarElement.innerHTML = '';
          }

          this.editorInstance = undefined;

          MultiRootEditor.create(
            {
              header: this.headerDiv.nativeElement,
              content: this.contentDiv.nativeElement,
              footer: this.footerDiv.nativeElement
            },
            editorConfig
          ).then((newEditor) => {
            this.editorInstance = newEditor;
            toolbarElement?.appendChild(newEditor.ui.view.toolbar.element!);
            newEditor.setData({
              header: headerData,
              content: contentData,
              footer: footerData
            });
          }).catch((error) => {
            console.error('Editor reinitialization error:', error);
          });
        })
        .catch((error) => {
          console.error('Error destroying editor:', error);
        });
    }
  }

  createMultiRootCkEditor() {
    MultiRootEditor.create(
      {
        header: this.headerDiv.nativeElement,
        content: this.contentDiv.nativeElement,
        footer: this.footerDiv.nativeElement
      },
      editorConfig
    )
      .then((editor) => {
        this.editorInstance = editor;
        document
          .querySelector('#toolbar')
          ?.appendChild(editor.ui.view.toolbar.element!);
      })
      .catch((error) => {
        console.error(
          'There was a problem initializing the editor.',
          error
        );
      });
  }

}
