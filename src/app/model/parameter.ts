export class Parameter {

  public name: string;

  public code: string;

  public type: string;

  public children: Parameter[];

  public editorAttributeMap: [];

  constructor(
    name: string,
    code: string,
    type: string,
    children: Parameter[],
    editorAttributeMap: []
  ) {
    this.name = name;
    this.code = code;
    this.type = type;
    this.children = children;
    this.editorAttributeMap = editorAttributeMap;
  }

}
