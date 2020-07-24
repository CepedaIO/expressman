import MemberService from "../services/MemberService";
import {Member} from "../repositories/MemberRepository";
import {GET, Input, Header, Query} from "../../../src";

export interface MemberIdentifier {
  id: string;
}

class GETMemberInput {
  @Query()
  limit:number;

  @Query()
  skip:number;

  @Header()
  traceId:string;
}

@Input(GETMemberInput)
@GET('/members')
export default class GETMember {
  constructor(
    private memberService:MemberService
  ) { }

  handle(payload:GETMemberInput): Member {
    return this.memberService.getActiveMembers()[0];
  }
}
