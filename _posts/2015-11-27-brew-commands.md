---
layout: post
title:  "Brew commands"
categories: cmd
tags: brew
---

To get around xcode license agreement errors:

{% highlight PowerShell %}
sudo xcodebuild -license
{% endhighlight %}


If brew starts having permission issues
{% highlight PowerShell %}
sudo chown -R $(whoami):admin /usr/local
{% endhighlight %}

To update brew
{% highlight PowerShell %}
brew update
{% endhighlight %}

To upgrade packages managed by brew
{% highlight PowerShell %}
brew upgrade
{% endhighlight %}
