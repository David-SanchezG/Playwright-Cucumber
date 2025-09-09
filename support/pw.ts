import { Page } from '@playwright/test';
import { HomePage } from '../pages/home';

export const pw = {
    page: undefined as Page,
    homePage: new HomePage()
}
