/* =====================================================================
   FOOTER — shared by all Yogi-Mahi games
   (The Baby's Journey, Myth-Buster and every new game)

   THIS FILE IS THE ONLY COPY. Edit it, refresh the browser, and every
   game shows the change. Works when a game is opened by double-clicking
   it AND when it is on a website.

   HOW TO EDIT: everything between the two backticks  `  below is plain
   HTML (with its <style> and <script>). Change it exactly as you would an
   .html file. Just don't type a backtick ` or ${ inside it.

   A game loads it with this line, just before </body>:
       <script src="../shared/footer.js"></script>
   ===================================================================== */
document.write(String.raw`
<style>
  /* Variables the footer uses */
  :root{
    --safeB:env(safe-area-inset-bottom,0px);
    --gutter:clamp(10px,2vw,22px);
    --footH:clamp(19px,2.8dvh,25px);
  }

  /* One line, fixed to the foot of the viewport and above every screen.
     It takes no clicks, so it can never sit in front of a button. */
  .site-footer{position:fixed; left:0; right:0; bottom:0; z-index:1400;
    height:calc(var(--footH) + var(--safeB));
    padding:0 var(--gutter) var(--safeB);
    display:flex; align-items:center; justify-content:center;
    font-size:clamp(11px,1.5dvh,13px); font-weight:600; line-height:1.2;
    color:#000; text-align:center; text-wrap:balance;
    pointer-events:none; -webkit-user-select:none; user-select:none;}

  /* Narrow screens: allow two lines and a taller strip */
  @media (max-width:600px){
    :root{--footH:clamp(29px,4.8dvh,38px);}
    .site-footer{font-size:11px; line-height:1.25;}
  }
</style>


<!-- A game gives its main wrapper padding-bottom:
     calc(var(--footH) + var(--safeB)) so no content hides under the footer. -->
<footer class="site-footer">© 2026 Vishuddha Social Foundation. All Rights Reserved to Yash.</footer>
`);
