document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.getElementById("quote-list")
    const quoteForm = document.getElementById("new-quote-form")

    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        data.forEach(element => {
            createQuote(element)
        });
    })

    quoteForm.addEventListener("submit", (e) => {
        e.preventDefault()
        let data = {
            quote: quoteForm["quote"].value,
            author: quoteForm["author"].value,
            likes: []
        }
        handleFormSubmit(data)
    })

    function createQuote(item) {
        const li = document.createElement("li")
        const html = `
            <blockquote class="blockquote">
            <p class="mb-0">${item.quote}</p>
            <footer class="blockquote-footer">${item.author}</footer>
            <br>
            <button id="like" class='btn-success'>Likes: <span>${item.likes.length}</span></button>
            <button id="delete" class='btn-danger'>Delete</button>
            </blockquote>
        `
        li.innerHTML = html
        li.querySelector("#delete").addEventListener("click", () => {
            li.remove()
            deleteQuote(item.id)
        })
        li.querySelector("#like").addEventListener("click", () => {
            let span = li.querySelector("span")
            likeQuote(item.id, span)
        })
        quoteList.append(li)
    }

    function handleFormSubmit(data) {
        fetch("http://localhost:3000/quotes?_embed=likes", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => createQuote(data))
    }

    function deleteQuote(id) {
        fetch(`http://localhost:3000/quotes/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => console.log(data))
    }

    function likeQuote(itemId, span) {
        console.log(itemId)
        fetch(`http://localhost:3000/likes?quoteId=${id}`, {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quoteId: itemId,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            span.innerText = parseInt((data.id)-1)
        })
    }
})