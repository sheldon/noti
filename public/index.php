<?php
exec('../growlnotify -m "'.$_GET['route'].'" --image ../icon.png Incoming Phone Call');
?>