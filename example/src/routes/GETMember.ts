import MemberService from "../services/MemberService";
import {Member} from "../repositories/MemberRepository";
import {GET, Input, Header, Query} from "../../../src";

class GETMembersInput {
  @Query()
  limit:number;

  @Query({
    validate(input: any): void | Promise<void> {
      if(isNaN(input) || input < 5) throw new Error('Skip must be a number greater than five');
    }
  })
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

  handle(payload:GETMembersInput): Member {
    debugger;
    return this.memberService.getActiveMembers()[0];
  }
}
