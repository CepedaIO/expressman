
import {API, GET, Header} from "../../../src";
import {Swagger} from "../../../src/decorators/Swagger/Swagger";
import MemberService from "../services/MemberService";
import {Member} from "../repositories/MemberRepository";

class GETMembersInput {
  limit:number;
  skip:number;

  @Header()
  traceId:string;
}

@API('/')
export default class GETMember {
  constructor(
    private memberService:MemberService
  ) { }

  @Swagger()
  @GET('/members')
  handle(payload:GETMembersInput): Member {
    return this.memberService.getActiveMembers()[0];
  }
}
