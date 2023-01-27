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

import { personCard, editThin, privacyPublic } from '../icons/facebook'

import { WEBSITE } from '../constants'
import { formatPronouns, formatPronounsLong } from '../utils/pronouns'
import { fetchPronouns } from '../utils/fetch'
import { fetchReactProp } from '../utils/proxy'
import { h } from '../utils/dom'

export const name = 'Facebook'
export const color = '#4267B2'
export const match = /^https:\/\/(.+\.)?facebook\.com/
export { default as Icon } from 'simple-icons/icons/facebook.svg'

async function handleProfileTilesFeed (node: HTMLElement) {
  const id = await fetchReactProp(node, [ 'child', 'child', 'memoizedProps', 'profileTileSection', '__fragmentOwner', 'variables', 'userID' ])
  const list = node.querySelector('ul')
  if (!id || !list) return

  const pronouns = await fetchPronouns('facebook', id)
  if (pronouns === 'unspecified') return

  list.appendChild(
    h(
      'div',
      { style: 'display: flex; margin: -6px; padding-top: 16px;' },
      h('div', { style: 'padding: 6px; width: 20px; height: 20px;' }, personCard()),
      h('div', { style: 'align-self: center; padding: 6px; color: var(--primary-text); font-size: .875rem;' }, formatPronounsLong(pronouns))
    )
  )
}

async function handleProfileAbout (node: HTMLElement) {
  document.querySelector('[data-pronoundb]')?.remove()
  const id = await fetchReactProp(node, [ 'child', 'child', 'memoizedProps', 'section', '__fragmentOwner', 'variables', 'userID' ])
  if (!id) return

  const pronouns = await fetchPronouns('facebook', id)
  if (pronouns === 'unspecified') return

  const isSelf = Boolean((node.firstChild?.firstChild as HTMLElement).querySelector('i'))
  node.firstChild?.appendChild(
    h(
      'div',
      { style: 'margin-top: 24px; display: flex; align-items: center;', 'data-pronoundb': true },
      h('div', { style: 'padding: 6px 6px 6px 0; width: 24px; height: 24px; filter: brightness(0.85);' }, personCard(24, 24)),
      h('div', { style: 'padding: 6px; color: var(--primary-text); font-size: .9375rem; flex: 1;' }, formatPronounsLong(pronouns)),
      isSelf && h(
        'div',
        { style: 'display: flex;' },
        h(
          'div',
          { style: 'width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: not-allowed; filter: var(--filter-disabled-icon); margin-right: 5px;' },
          privacyPublic()
        ),
        h(
          'a',
          { href: `${WEBSITE}/me`, target: '_blank', style: 'width: 36px; height: 36px; border-radius: 50%; background-color: var(--secondary-button-background); display: flex; align-items: center; justify-content: center;' },
          h('span', { style: 'filter: var(--filter-primary-icon); width: 20px; height: 20px;' }, editThin())
        )
      )
    )
  )
}

function preprocessProfileAbout (node: HTMLElement) {
  const overview = node.querySelector('a[href*="about_overview"]')
  if (!overview) return

  async function doInject () {
    let about
    for (let i = 0; i < 10; i++) {
      about = document.querySelector<HTMLElement>('[data-pagelet="ProfileAppSection_0"] div + div > div > div')
      if (about) break

      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    if (!about) return
    handleProfileAbout(about)
  }

  overview.addEventListener('click', () => doInject())
  doInject()
}

async function handlePopOut (popout: HTMLElement) {
  const id = await fetchReactProp(popout, [ 'child', 'child', 'child', 'child', 'child', 'memoizedProps', 'entity', '__id' ])
  const list = popout.querySelector('a[role="link"]')?.parentElement?.parentElement?.lastElementChild?.firstChild?.firstChild?.lastChild?.firstChild
  if (!id || !list) return

  const pronouns = await fetchPronouns('facebook', id)
  if (pronouns === 'unspecified') return

  const filter = 'invert(41%) sepia(8%) saturate(507%) hue-rotate(179deg) brightness(93%) contrast(91%)'
  list.appendChild(
    h(
      'div',
      { style: 'display: flex; margin: -6px; padding: 8px 16px;' },
      h('div', { style: `filter: ${filter}; padding: 6px; width: 20px; height: 20px;` }, personCard()),
      h('div', { style: 'align-self: center; padding: 6px; color: var(--primary-text); font-size: .875rem;' }, formatPronounsLong(pronouns))
    )
  )
}

async function handleArticle (article: HTMLElement) {
  const target = (article as any).ariaDescribedByElements[0]
  if (!target) return

  const id = await fetchReactProp(target, [ 'child', 'child', 'memoizedProps', 'match', '__fragmentOwner', 'variables', 'userID' ])
  if (!id) return

  const pronouns = await fetchPronouns('facebook', id)
  if (pronouns === 'unspecified') return

  target.appendChild(
    h('span', { style: 'font-size: .75rem; color: var(--secondary-text);', class: 'pronoundb-pronouns' }, ` · ${formatPronouns(pronouns)}`)
  )
}

async function handleMutation (nodes: MutationRecord[]) {
  for (const { addedNodes } of nodes) {
    for (const added of addedNodes) {
      if (added instanceof HTMLElement) {
        if (added.dataset?.pagelet === 'ProfileTilesFeed_0') {
          handleProfileTilesFeed(added)
          continue
        }

        const profileTilesFeed = added.querySelector<HTMLElement>('[data-pagelet="ProfileTilesFeed_0"]')
        if (profileTilesFeed) {
          handleProfileTilesFeed(profileTilesFeed)
          continue
        }

        const articles = added.querySelectorAll<HTMLElement>('[role="article"][aria-describedby]')
        if (articles && articles.length !== 0) {
          articles.forEach((article) => handleArticle(article))
          continue
        }

        if (document.querySelector('[data-pagelet="ProfileTabs"] a[href*="/about"] div div')?.className) {
          const section = document.querySelector<HTMLElement>('[data-pagelet="ProfileAppSection_0"]')
          if (added.contains(section)) {
            preprocessProfileAbout(section!)
            continue
          }
        }

        if (added.tagName === 'DIV' && added.className && added.querySelector('image') && added.parentElement?.hasAttribute('hidden')) {
          handlePopOut(added)
          continue
        }
      }
    }
  }
}

export function inject () {
  const observer = new MutationObserver(handleMutation)
  observer.observe(document, { childList: true, subtree: true })

  const profileTilesFeed = document.querySelector<HTMLElement>('[data-pagelet="ProfileTilesFeed_0"]')
  if (profileTilesFeed) handleProfileTilesFeed(profileTilesFeed)

  if (document.querySelector('[data-pagelet="ProfileTabs"] a[href*="/about"] div div')?.className) {
    const section = document.querySelector<HTMLElement>('[data-pagelet="ProfileAppSection_0"]')
    if (section) {
      preprocessProfileAbout(section)
    }
  }

  const articles = Array.from(document.querySelectorAll('[role="article"][aria-describedby]')) as HTMLElement[]
  articles.forEach((article) => handleArticle(article))
}

// Scrapper to get the Real ID of people authenticating to PronounDB
export function main () {
  if (location.pathname === '/v13.0/dialog/oauth') {
    const search = new URLSearchParams(location.search)
    if (!search.get('state') || !search.get('redirect_uri') || search.get('state')!.includes(';;;')) return

    const redirectOrigin = new URL(search.get('redirect_uri')!).origin
    if (redirectOrigin === WEBSITE) {
      console.log('[PronounDB] Detected OAuth flow for PronounDB')

      const data = Array.from(document.querySelectorAll('script')).find((s) => (s as HTMLElement).textContent?.includes('ACCOUNT_ID')) as HTMLElement
      const id = data.textContent?.match(/ACCOUNT_ID":"(\d+)/)?.[1]
      if (!id) {
        console.warn('[PronounDB] Failed to find the Real User ID. Authentication flow will fail.')
        return
      }

      search.set('state', `${search.get('state')};;;${btoa(id).replace(/=/g, '')}`)
      location.search = `?${search.toString()}`
    }
  }
}
