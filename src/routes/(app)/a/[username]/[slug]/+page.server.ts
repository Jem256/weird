import type { PageServerLoad } from './$types';
import { appendSubpath, getMarkdownPage, profileLinkByUsername } from '$lib/leaf/profile';
import { error } from '@sveltejs/kit';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import { PUBLIC_DOMAIN } from '$env/static/public';

export const load: PageServerLoad = async ({
	params
}): Promise<{ slug: string; username: string; html?: string }> => {
	const username = params.username.includes('@')
		? params.username.toString()
		: `${params.username}@${PUBLIC_DOMAIN}`;
	const profileLink = await profileLinkByUsername(username);
	if (!profileLink) return error(404, `User not found: ${username}`);
	const pageLink = appendSubpath(profileLink, params.slug);
	const markdown = await getMarkdownPage(pageLink);
	if (!markdown) return error(404, 'Page not found');

	return {
		slug: params.slug,
		username: params.username,
		html: DOMPurify(new JSDOM().window).sanitize(marked.parse(markdown) as string)
	};
};
