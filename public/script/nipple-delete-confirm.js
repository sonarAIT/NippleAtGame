function nippleDeleteConfirm(imageID) {
    if (confirm("乳首画像を削除してもよろしいですか？この操作は取り消せません。")) {
        const id = "delete-form-" + imageID;
        const form = document.getElementById(id);
        form.submit();
    }
}