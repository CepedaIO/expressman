import {Route} from "../../src/decorators";
import MemberService from "../services/MemberService";

@Route('GET', '/members')
export default class GetMembers {
  constructor(
    private memberService:MemberService
  ) { }

  handle() {
    return this.memberService.getActiveMembers();
  }
}