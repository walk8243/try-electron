import PriorityQueue, {
	type PriorityQueueOptions,
} from 'p-queue/dist/priority-queue';
import { RunFunction } from 'p-queue/dist/queue';

export const QUEUE_CONCURRENCY = 2; // 並列処理数
export const QUEUE_INTERVAL = 60 * 1000; // 制約期間
export const QUEUE_INTERVAL_CAP = 20; // 制約期間内の処理回数
export const QUEUE_SIZE_LIMIT = 100; // キューの最大サイズ

export class CustomQueueClass extends PriorityQueue {
	enqueue(run: RunFunction, options?: Partial<PriorityQueueOptions>) {
		if (this.size >= QUEUE_SIZE_LIMIT) {
			if (!options || !options.priority || options.priority < 1) {
				return;
			}
		}
		super.enqueue(run, options);
	}
}
