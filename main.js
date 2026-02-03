async function getData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        let body = document.getElementById('table_body');
        body.innerHTML = '';

        for (const post of posts) {
            let style = post.isDeleted ? 
                "style='text-decoration: line-through; color: gray;'" : "";

            body.innerHTML += `
                <tr ${style}>
                    <td>${post.id}</td>
                    <td>${post.title}</td>
                    <td>${post.views}</td>
                    <td>
                        <button onclick="Delete(${post.id})">Delete</button>
                    </td>
                </tr>`;
        }
    } catch (error) {
        console.log(error);
    }
}

async function Save() {
    let id = document.getElementById('txt_id').value;
    let title = document.getElementById('txt_title').value;
    let views = document.getElementById('txt_views').value;

    // Lấy toàn bộ posts để tìm maxId
    let resAll = await fetch('http://localhost:3000/posts');
    let posts = await resAll.json();

    if (id) {
        // ===== UPDATE =====
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: Number(id),
                title: title,
                views: Number(views),
                isDeleted: false
            })
        });

        if (res.ok) {
            console.log("Cập nhật thành công");
            getData();
        }
    } else {
        // ===== CREATE (ID TỰ TĂNG) =====
        let maxId = 0;
        for (const p of posts) {
            if (p.id > maxId) maxId = p.id;
        }

        let newId = maxId + 1;

        let res = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: newId,
                title: title,
                views: Number(views),
                isDeleted: false
            })
        });

        if (res.ok) {
            console.log("Thêm mới thành công");
            getData();
        }
    }
}

// ===== XÓA MỀM =====
async function Delete(id) {
    let resGet = await fetch('http://localhost:3000/posts/' + id);
    let post = await resGet.json();

    let res = await fetch('http://localhost:3000/posts/' + id, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...post,
            isDeleted: true
        })
    });

    if (res.ok) {
        console.log("Xóa mềm thành công");
        getData();
    }
}

getData();
