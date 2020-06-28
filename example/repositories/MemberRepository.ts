import {injectable} from "tsyringe";

@injectable()
export default class MemberRepository {
  getMembers():Member[] {
    return [
      { firstname:'Alfred', lastname:'Cepeda' }
    ];
  }
}