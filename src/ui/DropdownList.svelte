<script>
    export let title;
</script>

<div class="dropdown">
  <button class="btn btn-outline-dark btn-block dropdown-toggle" type="button" id="BaseMapButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
 {title}
  </button>
  <div class="dropdown-menu" aria-labelledby="BaseMapButton">
    <slot></slot>
  </div>
</div>

