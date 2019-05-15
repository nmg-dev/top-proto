<template>
    <b-card
        title="Card Title"
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
        >
        <b-card-text>
            Some quick example text to build on the card title and make up the bulk of the card's content.
        </b-card-text>

        <b-dropdown text="test dropdown">
            <b-dropdown-item>Item1</b-dropdown-item>
            <b-dropdown-item>Item2</b-dropdown-item>
            <b-dropdown-item>Item3</b-dropdown-item>
            <b-dropdown-item>Item4</b-dropdown-item>
        </b-dropdown>

    </b-card>
</template>

<script>
export default {
    name: 'CardPanel',
    props: ['title','text'],
}
</script>