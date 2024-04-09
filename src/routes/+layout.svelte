<script>
  import "../app.css";
</script>

<slot />


<ul class="list-inside ...">
  <li>5 cups chopped Porcini mushrooms</li>
  <!-- ... -->
</ul>


<div class="grid grid-cols-3 gap-4">
  <div class="...">01</div>
  <div class="...">02</div>
  <div class="...">03</div>
  <div class="col-span-2 ...">04</div>
  <div class="...">05</div>
  <div class="...">06</div>
  <div class="col-span-2 ...">07</div>
</div>



<div class="columns-5">
  <p>Well, let me tell you something, ...</p>
  <p>asdf</p>
  <p>Sure, go ahead, laugh...</p>


  <div>stuff</div>
  <div>stuff2</div>
  <div>stuf3</div>

  <div>
  When controlling the flow of text, using the CSS property
  <span class="inline">display: inline inline inline</span>
  will cause the text inside the element to wrap normally.

  While using the property <span class="inline-block">display: inline-block</span>
  will wrap the element to prevent the text inside from extending beyond its parent.

  Lastly, using the property <span class="block">display: block</span>
  will put the element on its own line and fill its parent.
</div>

</div>