interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}

// variables: { name: 'Alexandre', link: 'http://..', idade: 40 }
