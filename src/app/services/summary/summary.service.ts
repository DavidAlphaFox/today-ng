import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { TodoService } from '../todo/todo.service';
import { Summary, Todo } from '../../../domain/entities';
import { getTodayTime, floorToDate, ONE_DAY } from '../../../utils/time';
import { START_USING_DATE } from '../local-storage/local-storage.namespace';


const LAST_DATE = 'LAST_DATE';

@Injectable()
export class SummaryService {
  private lsKey = 'summaries';

  private summaries: Summary[] = [];

  constructor(
    private store: LocalStorageService,
    private todoService: TodoService,
  ) { }

  public doSummary(): void {
    const todayDate = getTodayTime();
    let lastDate = this.store.get(LAST_DATE) as number || this.store.get(START_USING_DATE);

    // If the summary has been performed yesterday, it's necessary to run it again.
    if (lastDate === todayDate) { return; }

    console.log('Summarizing between', lastDate, ' and ', todayDate);

    const todos = this.todoService.getRaw();
    const todosToAna: Todo[] = [];
    const summaries: Summary[] = [];
    const dates: number[] = [];

    // Prepare todos that should be analyzed.
    todos.forEach((todo) => {
      if (!!todo.planAt) {
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
          if (!!todo.completedFlag && floorToDate(todo.completedAt) === date) {
            completedItems.push(todo.title);
          } else if (!!todo.completedFlag && floorToDate(todo.completedAt === todayDate)) {
            // Do nothing.
          } else {
            uncompletedItems.push(todo.title);
          }
        }
      });

      const summary = new Summary(date, completedItems, uncompletedItems);

    });

    this.store.set(LAST_DATE, lastDate);
    this.addSummaries(summaries);
  }

  public summaryForDate(date: Date | number): Summary {
    const innerDate = date instanceof Date ? date.getTime() : date;
    return this.summaries.find(s => s.date === innerDate);
  }

  private loadSummaries(): Summary[] {
    return this.store.getList<Summary>(this.lsKey);
  }

  private addSummaries(summaries: Summary[]): void {
    const oldSummaries = this.loadSummaries();
    const newSummaries = oldSummaries.concat(summaries);
    this.store.set(this.lsKey, newSummaries);
  }
}
