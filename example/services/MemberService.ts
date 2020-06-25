import MemberRepository from "../repositories/MemberRepository";
import {injectable} from "tsyringe";

@injectable()
export default class MemberService {
  constructor(
    private memberRepository:MemberRepository
  ) { }

  getActiveMembers() {
    return this.memberRepository.getMembers().filter(member => member.active);
  }
}