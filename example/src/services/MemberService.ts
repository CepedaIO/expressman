import MemberRepository, {Member} from "../repositories/MemberRepository";
import {injectable} from "tsyringe";

@injectable()
export default class MemberService {
  constructor(
    private memberRepository:MemberRepository
  ) { }

  getActiveMembers():Member[] {
    return this.memberRepository.getMembers();
  }
}
