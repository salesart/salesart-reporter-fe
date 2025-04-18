export class ReportPreview {

  public htmlHeaderPart: string | undefined;

  public htmlMainPart: string | undefined;

  public htmlFooterPart: string | undefined;

  public pageProperties: ReportPagePreviewProperties;

  public parameterMap: any;

  constructor(
    htmlHeaderPart: string,
    htmlMainPart: string,
    htmlFooterPart: string,
    pageProperties: ReportPagePreviewProperties,
    parameterMap: any
  ) {
    this.htmlHeaderPart = htmlHeaderPart;
    this.htmlMainPart = htmlMainPart;
    this.htmlFooterPart = htmlFooterPart;
    this.pageProperties = pageProperties;
    this.parameterMap = parameterMap;
  }

}

export class Report {

  public id: number;

  public type: string;

  public code: string;

  public name: string;

  public description: string;

  public enabled: boolean;

  public htmlHeaderPart: string | undefined;

  public htmlMainPart: string | undefined;

  public htmlFooterPart: string | undefined;

  public pageProperties: ReportPageProperties;

  constructor(
    id: number,
    type: string,
    code: string,
    name: string,
    description: string,
    enabled: boolean,
    htmlHeaderPart: string | undefined,
    htmlMainPart: string | undefined,
    htmlFooterPart: string | undefined,
    pageProperties: ReportPageProperties
  ) {
    this.id = id;
    this.type = type;
    this.code = code;
    this.name = name;
    this.description = description;
    this.enabled = enabled;
    this.htmlHeaderPart = htmlHeaderPart;
    this.htmlMainPart = htmlMainPart;
    this.htmlFooterPart = htmlFooterPart;
    this.pageProperties = pageProperties;
  }

}

export class ReportPageProperties {

  public size: string;

  public specialPageWidth: string;

  public specialPageHeight: string;

  public topMargin: string;

  public leftMargin: string;

  public rightMargin: string;

  public bottomMargin: string;

  public headerHeight: string;

  public footerHeight: string;

  public numberOfCopies: string;

  constructor(
    size: string,
    specialPageWidth: string,
    specialPageHeight: string,
    topMargin: string,
    leftMargin: string,
    rightMargin: string,
    bottomMargin: string,
    headerHeight: string,
    footerHeight: string,
    numberOfCopies: string
  ) {
    this.size = size;
    this.specialPageWidth = specialPageWidth;
    this.specialPageHeight = specialPageHeight;
    this.topMargin = topMargin;
    this.leftMargin = leftMargin;
    this.rightMargin = rightMargin;
    this.bottomMargin = bottomMargin;
    this.headerHeight = headerHeight;
    this.footerHeight = footerHeight;
    this.numberOfCopies = numberOfCopies;
  }
}

export class ReportPagePreviewProperties {

  public size: string;

  public topMargin: string;

  public leftMargin: string;

  public rightMargin: string;

  public bottomMargin: string;

  public headerTopMargin: string;

  public footerBottomMargin: string;

  constructor(
    size: string,
    topMargin: string,
    leftMargin: string,
    rightMargin: string,
    bottomMargin: string,
    headerTopMargin: string,
    footerBottomMargin: string
  ) {
    this.size = size;
    this.topMargin = topMargin;
    this.leftMargin = leftMargin;
    this.rightMargin = rightMargin;
    this.bottomMargin = bottomMargin;
    this.headerTopMargin = headerTopMargin;
    this.footerBottomMargin = footerBottomMargin;
  }
}
