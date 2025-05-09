declare module "*.json" {
  const content: {
    templates: Array<{
      id: string;
      name: string;
      description: string;
      template_id: string;
      fields: Array<{
        step: number;
        section: string;
        fields: Array<{
          id: string;
          name: string;
          type: string;
          required: boolean;
          placeholder: string;
          rows?: number;
        }>;
        infoText?: string;
      }>;
      defaults?: Record<string, string>;
    }>;
  };
  export default content;
}
