import {Route} from "../../src/decorators";
import MemberService from "../services/MemberService";

@Route('GET', '/members')
export default class GETMember {
  constructor(
    private memberService:MemberService
  ) { }

  handle(payload:MemberIdentifier): Member {
    return this.memberService.getActiveMembers()[0];
  }
}
