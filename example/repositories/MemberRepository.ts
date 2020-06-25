import {injectable} from "tsyringe";

@injectable()
export default class MemberRepository {
  getMembers() {
    return [
      { name:'Alfred', role:'Admin', active: true }
    ];
  }
}