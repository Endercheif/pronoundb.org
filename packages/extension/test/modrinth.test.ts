/*
 * Copyright (c) Cynthia Rey et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import test from './test.js'
import { expect } from '@playwright/test'

test('Profile shows pronouns', async ({ page }) => {
  await page.goto('https://modrinth.com/user/cyyynthia')
  await expect(page.locator('.card.sidebar >> text=it/its')).toHaveCount(1)
})

test('Mod page shows developers\' pronouns', async ({ page }) => {
  await page.goto('https://modrinth.com/mod/sodium')

  const devLocator = page.locator('.extra-info-desktop.card .team-member')
  await expect(devLocator.first()).toBeVisible()
  const devs = await devLocator.count()

  await expect(devLocator.locator('text=they/them')).toHaveCount(devs)
})

// IDs are not exposed here, so it's not implemented. Leaving the test 'just in case'
test.skip('Listing page shows pronouns', async ({ page }) => {
  await page.goto('https://modrinth.com/mods')
  await expect(page.locator('.project-card.card .info .top >> text=(they/them)')).toHaveCount(20)
})

test.describe('Implementation quirks', () => {
  test('Pronouns show when going to profile from another page', async ({ page }) => {
    await page.goto('https://modrinth.com/user/cyyynthia')
    await expect(page.locator('.card.sidebar >> text=it/its')).toHaveCount(1)

    await page.click('.nav a[href="/mods"]')
    await page.waitForSelector('#search-results')
    await page.goBack()

    await expect(page.locator('.card.sidebar >> text=it/its')).toHaveCount(1)
  })

  test('Pronouns show when going to mod from another page', async ({ page }) => {
    await page.goto('https://modrinth.com/user/jellysquid3')
    await expect(page.locator('.card.sidebar >> text=they/them')).toHaveCount(1)

    await page.click('.project-card a')

    const devLocator = page.locator('.extra-info-desktop.card .team-member')
    await expect(devLocator.first()).toBeVisible()
    const devs = await devLocator.count()

    await expect(devLocator.locator('text=they/them')).toHaveCount(devs)
  })
})
