import { afterEach, describe, expect, mock, test } from 'bun:test';

mock.module('../stores/auth.js', () => ({
	refreshAccessToken: mock(async () => 'fresh-token'),
}));

const { apiUpload } = await import('./http.js');
const { refreshAccessToken } = await import('../stores/auth.js');

class MockXMLHttpRequest {
	static instances = [];
	static responses = [];

	upload = {};
	headers = {};

	open(method, url) {
		this.method = method;
		this.url = url;
	}

	setRequestHeader(name, value) {
		this.headers[name] = value;
	}

	send(body) {
		this.body = body;
		MockXMLHttpRequest.instances.push(this);
		const response = MockXMLHttpRequest.responses.shift();
		queueMicrotask(() => {
			this.status = response.status;
			this.responseText = JSON.stringify(response.body);
			this.onload();
		});
	}
}

describe('apiUpload', () => {
	const originalXHR = globalThis.XMLHttpRequest;

	afterEach(() => {
		globalThis.XMLHttpRequest = originalXHR;
		MockXMLHttpRequest.instances = [];
		MockXMLHttpRequest.responses = [];
		refreshAccessToken.mockClear();
	});

	test('utilise le token rafraîchi après une réponse 401', async () => {
		globalThis.XMLHttpRequest = MockXMLHttpRequest;
		MockXMLHttpRequest.responses = [
			{ status: 401, body: { error: 'TOKEN_EXPIRE' } },
			{ status: 200, body: { id: 1 } },
		];

		const result = await apiUpload('/evenements/1', {
			token: 'expired-token',
			body: new FormData(),
		});

		expect(result).toEqual({ id: 1 });
		expect(MockXMLHttpRequest.instances.map(({ headers }) => headers.Authorization)).toEqual([
			'Bearer expired-token',
			'Bearer fresh-token',
		]);
		expect(refreshAccessToken).toHaveBeenCalledTimes(1);
	});
});
