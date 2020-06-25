interface IContactInformation {
  firstname: string;
  lastname: string;
}

interface ICredentials {
  username: string;
  password: string;
}

export class SimpleClass implements IRouteHandler {
  handle(payload:IContactInformation): ICredentials {
    return {
      username: 'Test',
      password: 'Password'
    }
  }
}