<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import SetHandleModal from './components/ChangeHandleModal.svelte';

	const { data, children }: { children: Snippet; data: PageData } = $props();

	const modalStore = getModalStore();
	let error: string | null = $state(null);

	const setHandleModal: ModalSettings = $derived({
		type: 'component',
		component: { ref: SetHandleModal },
		subspace: data.subspace,
		async response(r) {
			if ('error' in r) {
				error = r.error;
			} else {
				error = null;
			}
		}
	});
</script>

<div class="flex flex-row flex-wrap-reverse sm:flex-nowrap">
	{#if data.profileMatchesUserSession}
		<aside
			class="card sticky top-8 mx-4 my-8 flex w-full min-w-[15em] flex-col p-5 sm:h-[85vh] sm:w-auto"
		>
			<div class="mb-3 flex flex-row items-start justify-between">
				<h1 class="mb-2 text-xl font-bold">Pages</h1>
				<a
					title="Add Page"
					class="variant-ghost btn-icon btn-icon-sm"
					href={`/${$page.params.username}/new`}
				>
					<Icon icon="fluent:add-12-filled" font-size="1.5em" />
				</a>
			</div>

			<div class="flex flex-col gap-2">
				<a class="variant-ghost btn" href={`/${$page.params.username}`}>Profile</a>
				{#each data.pages as p}
					<a class="variant-ghost btn" href={`/${$page.params.username}/${p.slug}`}
						>{p.name || p.slug}</a
					>
				{/each}
			</div>

			<div class="flex-grow"></div>

			<h2 class="mb-2 text-lg font-bold">Settings</h2>
			<button class="variant-ghost btn" onclick={() => modalStore.trigger(setHandleModal)}>
				Change Handle
			</button>
		</aside>
	{/if}

	<div class="hidden flex-grow sm:block"></div>

	<div class="flex flex-col items-center">
		{#if error}
			<aside class="alert variant-ghost-error relative mt-8 w-full">
				<div class="alert-message">
					<p>{error}</p>
				</div>
			</aside>
		{/if}
		{@render children()}
	</div>

	<div class="hidden flex-grow sm:block"></div>
</div>
