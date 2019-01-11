<template>
	<div
		class="video"
	>
		<VCard>
			<VToolbar color="white" flat>
				<VBtn
					icon
					light
					to="/"
				>
					<VIcon color="grey darken-2">fas fa-arrow-left</VIcon>
				</VBtn>
				<VToolbarTitle>asd</VToolbarTitle>
			</VToolbar>
			<VContainer fluid>
				<VLayout>
					<VFlex xs12 md8>
						<iframe
							:src="`https://www.youtube.com/embed/${$route.params.id}?autoplay=1`"
							width="100%"
							type="text/html"
							frameborder="0"
						/>
					</VFlex>
					<VFlex xs12 md4>
						Desc
					</VFlex>
				</VLayout>
			</VContainer>
		</VCard>
	</div>
</template>
