import { Injectable } from '@nestjs/common';
import { CreateAppLogDto } from '../dto/create-app-log.dto';
import { diff } from 'json-diff';

@Injectable()
export class AppLogsHelper {
  keysToNotLog = [
    'admins',
    'admins_ids',
    'users',
    'users_ids',
    'boards',
    'boards_ids',
    'companies',
    'companies_ids',
    'recurrence_meetings',
    'guests',
    'guests_ids',
    'files',
    'files_ids',
    'members',
    'meetings',
    'members_ids',
    'childrens',
    'childrens_ids',
    'viewers',
    'viewers_ids',
    'subscribers',
    'subscribers_ids',
    'id',
    'created_at',
    'updated_at',
    'refresh_token_zoom',
  ];
  filterObjForUpdateLog(obj1: object, obj2: object): object {
    if (!obj1 || !obj2) return {};
    const chavesObj2 = Object.keys(obj2);
    const novoObj = {};

    for (const chave in obj1) {
      if (chavesObj2.includes(chave) && !this.keysToNotLog.includes(chave)) {
        novoObj[chave] = obj1[chave];
      }
    }

    return novoObj;
  }

  getLogData(createAppLogDto: CreateAppLogDto) {
    const camposAlterados = diff(
      createAppLogDto.old_value,
      createAppLogDto.new_value,
    );
    const oldValue = createAppLogDto.old_value
      ? JSON.stringify(
          this.filterObjForUpdateLog(
            createAppLogDto.old_value,
            camposAlterados,
          ),
        )
      : '';
    const newValue = createAppLogDto.new_value
      ? JSON.stringify(
          this.filterObjForUpdateLog(
            createAppLogDto.new_value,
            camposAlterados,
          ),
        )
      : '';
    return {
      ...createAppLogDto,
      old_value: oldValue,
      new_value: newValue,
    };
  }
}
