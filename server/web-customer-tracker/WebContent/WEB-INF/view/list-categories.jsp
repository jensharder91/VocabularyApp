<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html>
<head>
<title>Category List</title>
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/style.css" />
<%-- <link href="<c:url value='/resources/css/style.css' />" rel="stylesheet">
</head> --%>
<body>

	<div id="wrapper">
		<div id="header">
			<h2>Category List</h2>
		</div>
	</div>

	<div id="container">

		<!-- <input class="add button" type="button" value="Add Kategorie"
			onclick="window.location.href='addForom'; return false;" /> -->

		<!--  addlink with customer id -->
		<c:url var="addLink" value="/category/addForm"></c:url>


		<table>
			<tr>
				<th>Titel</th>
				<th><a href="${addLink}">Add new Category</a></th>
			</tr>

			<c:forEach var="category" items="${categories}">

				<!--  updatelink with category id -->
				<c:url var="updateLink" value="/category/updateForm">
					<c:param name="categoryId" value="${category.id}"></c:param>
				</c:url>
				<!--  deletelink with category id -->
				<c:url var="deleteLink" value="/category/delete">
					<c:param name="categoryId" value="${category.id}"></c:param>
				</c:url>
				<!--  showlink with category id -->
				<c:url var="showLink" value="/group/show">
					<c:param name="categoryId" value="${category.id}"></c:param>
				</c:url>

				<tr>
					<td>${category.title}</td>
					<td><a href="${showLink}">Show</a> | <a href="${updateLink}">Update</a>
						| <a href="${deleteLink}"
						onClick="if(!(confirm('Are you sure you want to delete this category?'))) return false">Delete</a></td>
				</tr>
			</c:forEach>
		</table>
	</div>
</body>
</html>