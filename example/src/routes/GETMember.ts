import MemberService from "../services/MemberService";
import {Member} from "../repositories/MemberRepository";
import {Header} from "../../../src";
import {Input} from "../../../src/decorators/RouteHandler/Input";
import {GET} from "../../../src/decorators/RouteHandler/Route";
import {Swagger} from "../../../src/decorators/Swagger/Swagger";

class GETMembersInput {

  limit:number;
  
  skip:number;

  @Header()
  traceId:string;
}

@Input(GETMembersInput)
@GET('/members')
export default class GETMember {
  constructor(
    private memberService:MemberService
  ) { }

  @Swagger()
  handle(payload:GETMembersInput): Member {
    return this.memberService.getActiveMembers()[0];
  }
}
