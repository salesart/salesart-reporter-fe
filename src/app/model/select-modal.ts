export interface SelectModal {
  value: string;
  viewValue: string;
}

export const PageSizeSelectModalData: SelectModal[] = [
  {value: '210mm 297mm', viewValue: 'A4 (E: 827, B: 1169)'},
  {value: '297mm 420mm', viewValue: 'A3 (E: 1169, B: 1654)'},
  {value: '148mm 210mm', viewValue: 'A5 (E: 583, B: 827)'},
  {value: '250mm 353mm', viewValue: 'B4 (E: 1169, B: 1654)'},
  {value: '176mm 250mm', viewValue: 'B5 (E: 1012, B: 1433)'},
  {value: '216mm 279mm', viewValue: 'Letter (E: 850, B: 1100)'},
  {value: '216mm 356mm', viewValue: 'Legal (E: 850, B: 1400)'},
  {value: '140mm 216mm', viewValue: 'Statement (E: 550, B: 850)'},
  {value: '184mm 267mm', viewValue: 'Executive (E: 725, B: 1050)'}
];


