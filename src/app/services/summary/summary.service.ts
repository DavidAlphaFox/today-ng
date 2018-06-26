import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { TodoService } from '../todo/todo.service';
import { Summary, Todo } from '../../../domain/entities';
import { getTodayTime, floorToDate, ONE_DAY } from '../../../utils/time';
import { LAST_SUMMARY_DATE, START_USING_DATE, SUMMARIES } from '../local-storage/local-storage.namespace';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class SummaryService {
  summaries: Summary[] = [];

  constructor(
    private store: LocalStorageService,
    private todoService: TodoService,
    private logger: LoggerService
  ) { }

  doSummary(): void {
    const todayDate = getTodayTime();
    let lastDate = this.store.get(LAST_SUMMARY_DATE) || floorToDate(this.store.get(START_USING_DATE));

    // If the summary has been performed yesterday, it's unnecessary to run it again.
    if (lastDate === todayDate) {
      this.logger.message('[INFO] there\'s no need to make summaries');
      return;
    }

    this.logger.message('[INFO] Summarizing between', new Date(lastDate), 'and', new Date(todayDate));

    const todos = this.todoService.getRaw();
    const todosToAna: Todo[] = [];
    const summaries: Summary[] = [];
    const dates: number[] = [];

    // Prepare todos that should be analyzed.
    todos.forEach((todo) => {
      if (todo.planAt) {
        const date = floorToDate(todo.planAt);
        if (date < todayDate) { todosToAna.push(todo); }
      }
    });

    while (lastDate < todayDate) {
      dates.push(lastDate);
      lastDate += ONE_DAY;
    }

    dates.forEach(date => {
      const completedItems: string[] = [];
      const uncompletedItems: string[] = [];

      todosToAna.forEach(todo => {
        const planAt = floorToDate(todo.planAt);
        if (planAt <= date) {
          if (todo.completedFlag && floorToDate(todo.completedAt) === date) {
            completedItems.push(todo.title);
          } else if (
            todo.completedFlag &&
            floorToDate(todo.completedAt) < date
          ) { /* do nothing */ } else {
            uncompletedItems.push(todo.title);
          }
        }
      });

      summaries.push(new Summary(date, completedItems, uncompletedItems));
    });

    this.logger.message('[INFO] last summary date updated to: ', new Date(lastDate));
    this.logger.message(`[INFO] created ${summaries.length} summaries`);
    this.store.set(LAST_SUMMARY_DATE, lastDate);
    this.addSummaries(summaries);
  }

  public summaryForDate(date: number): Summary {
    if (!this.summaries.length) { this.summaries = this.loadSummaries(); }
    return this.summaries.find(s => s.date === date);
  }

  private loadSummaries(): Summary[] {
    return this.store.getList<Summary>(SUMMARIES);
  }

  private addSummaries(summaries: Summary[]): void {
    const oldSummaries = this.loadSummaries();
    const newSummaries = oldSummaries.concat(summaries);
    this.store.set(SUMMARIES, newSummaries);
  }
}
