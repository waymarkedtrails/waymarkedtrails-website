<script>
    let { name = 'none', title = '', value = $bindable(0.5) } = $props();
</script>

<style>
    input[type=range] {
        width: 100%
    }

    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 8.4px;
      cursor: pointer;
      background: var(--theme-sub-color);
      border-radius: 1.3px;
      border: 0.2px solid #010101;
    }

    input[type=range]:focus::-webkit-slider-runnable-track {
      background: #367ebd;
    }

    input[type=range]::-moz-range-track {
      width: 100%;
      height: 8.4px;
      cursor: pointer;
      background: var(--theme-sub-color);
      border-radius: 1.3px;
      border: 0.2px solid #010101;
    }

    input[type=range]::-ms-track {
      width: 100%;
      height: 8.4px;
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      border-width: 16px 0;
      color: transparent;
    }
    input[type=range]::-ms-fill-lower {
      background: #2a6495;
      border: 0.2px solid #010101;
      border-radius: 2.6px;
    }
    input[type=range]:focus::-ms-fill-lower {
      background: var(--theme-sub-color);
    }
    input[type=range]::-ms-fill-upper {
      background: var(--theme-sub-color);
      border: 0.2px solid #010101;
      border-radius: 2.6px;
    }
    input[type=range]:focus::-ms-fill-upper {
      background: #367ebd;
    }

    .label-col {
        width: min-content;
    }

    .slider-col {
        width: max-content;
        padding: 0 8px
    }

</style>

<tr>
    <td class="label-col">
        <label for="slider-{name}">{title}</label>
    </td>
    <td class="slider-col">
        <input bind:value={value} id="slider-{name}" min="0" max="1.0" step="0.01" type="range">
    </td>
</tr>
