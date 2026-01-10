 document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();
});

function fetchUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(users => {
            console.log("Users received:", users);

            const tbody = document.querySelector('#userTable tbody');
            tbody.innerHTML = '';

            users.forEach(user => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.dob}</td>
                    <td>${user.email}</td>
                    <td>${user.mobile}</td>
                    <td>
                        ${user.photo 
                            ? `<img src="/uploads/${user.photo}" width="50" height="50">`
                            : 'No Photo'}
                    </td>
                    <td>
                        <button onclick="editUser(
                            ${user.id},
                            '${user.name}',
                            '${user.dob}',
                            '${user.email}',
                            '${user.mobile}'
                        )">
                            Edit
                        </button>

                        <a href="/delete-user/${user.id}" 
                           onclick="return confirm('Delete user?')">
                           Delete
                        </a>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
}

function editUser(id, name, dob, email, mobile) {
    document.getElementById('editForm').style.display = 'block';

    document.getElementById('editName').value = name;
    document.getElementById('editDob').value = dob;
    document.getElementById('editEmail').value = email;
    document.getElementById('editMobile').value = mobile;

    // VERY IMPORTANT
    document.getElementById('editForm').action = `/update-user/${id}`;
}
