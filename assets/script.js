;(function () {
  const endpoint =
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@gwtrev"

  const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  }

  function isPost(item) {
    return item.categories.length
  }

  function getMonth(postMonth) {
    return months[postMonth]
  }

  function renderPost(title, url, timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear(),
      day = date.getDate(),
      month = getMonth(date.getMonth()),
      datetimeAttribute = timestamp.split(" ")[0],
      visibleTime = `${month} ${day}, ${year}`,
      id = title.replace(/\s/g, "-").slice(0, 12)

    const post = document.createElement("li")
    post.className = "post"

    const header = document.createElement("h3")
    header.id = id

    const titleLink = document.createElement("a")
    titleLink.href = url
    titleLink.innerText = title

    const time = document.createElement("time")
    time.setAttribute("aria-labelledby", id)
    time.setAttribute("datetime", datetimeAttribute)
    time.innerText = visibleTime

    header.appendChild(titleLink)
    post.appendChild(header)
    post.appendChild(time)

    return post
  }

  function render() {
    if (!window.fetch) return

    fetch(endpoint)
      .then((res) => {
        if (res.ok) {
          return res.json()
        }

        throw new Error("Couldn't load posts. :(")
      })
      .then((data) => {
        const cache = localStorage.getItem("posts")
        const fetchedPosts = JSON.stringify(
          data.items.filter(isPost).slice(0, 10)
        )

        if (!cache || cache !== fetchedPosts) {
          localStorage.setItem("posts", fetchedPosts)
        }

        const target = document.getElementById("posts")
        const posts = JSON.parse(localStorage.getItem("posts"))

        target.innerHTML = ""

        posts.forEach((post) => {
          const postNode = renderPost(post.title, post.link, post.pubDate)
          target.appendChild(postNode)
        })
      })
  }

  render()
})()
