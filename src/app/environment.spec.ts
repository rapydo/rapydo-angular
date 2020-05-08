import { environment } from '@rapydo/../environments/environment'

describe('Environment', () => {

	it('environment', () => {

      	expect(environment).not.toBeUndefined();
	});

});