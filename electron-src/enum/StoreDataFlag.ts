import { safeUnreachable } from '../utils/typescript';

const VALID = Symbol('正当なデータ');
const INVALID = Symbol('不当なデータ');
type StoreDataFlagType = typeof VALID | typeof INVALID;
class StoreDataFlag {
	private flag: StoreDataFlagType;

	constructor(flag: StoreDataFlagType) {
		this.flag = flag;
	}

	public isInvalid(): boolean {
		switch (this.flag) {
			case VALID:
				return false;
			case INVALID:
				return true;
		}

		safeUnreachable(this.flag);
	}
}

export default {
	VALID: new StoreDataFlag(VALID),
	INVALID: new StoreDataFlag(INVALID),
} as const;
