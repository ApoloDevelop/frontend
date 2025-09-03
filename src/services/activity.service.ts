import { ActivityRepository } from "@/repositories/activity.repository";

export class ActivityService {
  static create = ActivityRepository.create;
  static listByUser = ActivityRepository.listByUser;
  static remove = ActivityRepository.remove;
}
