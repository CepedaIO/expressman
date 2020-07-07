export class InlineDefinition implements IRouteHandler {
  handle(payload:{ firstname:string }): { success:boolean; } {
    return { success: true };
  };
}