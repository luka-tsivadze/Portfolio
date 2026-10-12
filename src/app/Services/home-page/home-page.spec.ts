import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { HomePage } from './home-page';

describe('HomePage', () => {
  let service: HomePage;
  let httpTesting: HttpTestingController;
  const visitorsUrl =
    'https://portfolio-2fe89-default-rtdb.europe-west1.firebasedatabase.app/visitors';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HomePage);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('ignores visit-only fields but distinguishes a different screen size', async () => {
    const info = {
      timestamp: '2026-10-09T10:00:00.000Z',
      userAgent: 'Example Browser',
      platform: 'Example OS',
      language: 'en',
      timezone: 'Europe/Tbilisi',
      screen: '1920x1080',
      referrer: 'direct',
      ip: '203.0.113.42',
      city: 'Tbilisi',
      country: 'Georgia',
    };
    const serviceInternals = service as unknown as {
      createVisitorKey: (value: typeof info) => Promise<string>;
    };

    const firstKey = await serviceInternals.createVisitorKey(info);
    const laterKey = await serviceInternals.createVisitorKey({
      ...info,
      timestamp: '2026-10-10T10:00:00.000Z',
      referrer: 'https://example.com/',
    });
    const differentScreenKey = await serviceInternals.createVisitorKey({
      ...info,
      screen: '1280x720',
    });

    expect(firstKey).toBe(laterKey);
    expect(firstKey).not.toBe(differentScreenKey);
    expect(firstKey).toMatch(/^[a-f0-9]{64}$/);
  });

  it('does not write an unidentified visit when IP lookup fails', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('lookup failed')));

    await service.getVisitorInfo();

    const databaseRequests = httpTesting.match((request) => request.url.startsWith(visitorsUrl));
    expect(databaseRequests.length).toBe(0);
  });

  it('uses a deterministic Realtime Database key instead of a generated POST key', async () => {
    const geoResponse = {
      ok: true,
      json: async () => ({ ip: '203.0.113.42', city: 'Tbilisi', country_name: 'Georgia' }),
    } as Response;
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(geoResponse));

    const completed = service.getVisitorInfo();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const lookup = httpTesting.expectOne(
      (request) => request.method === 'GET' && request.url.startsWith(`${visitorsUrl}/`),
    );
    const keyedUrl = lookup.request.url;
    expect(keyedUrl).toMatch(/\/visitors\/[a-f0-9]{64}\.json$/);
    lookup.flush(null);

    await new Promise((resolve) => setTimeout(resolve, 0));
    const write = httpTesting.expectOne((request) => request.method === 'PUT');
    expect(write.request.url).toBe(keyedUrl);
    write.flush(null);

    await completed;
  });
});
