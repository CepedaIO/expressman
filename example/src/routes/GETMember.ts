import {GET} from "expressman";
import MemberService from "../services/MemberService";
import {Member} from "../repositories/MemberRepository";

export interface MemberIdentifier {
  id: string;
}

class GETMemberInput {

}

@GET('/members')
export default class GETMember {
  constructor(
    private memberService:MemberService
  ) { }

  handle(payload:MemberIdentifier): Member {
    return this.memberService.getActiveMembers()[0];
  }
}
