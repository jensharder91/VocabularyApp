<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html>
<head>
<title>List Customers</title>
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/style.css" />
<%-- <link href="<c:url value='/resources/css/style.css' />" rel="stylesheet">
</head> --%>
<body>

	<div id="wrapper">
		<div id="header">
			<h2>Gruppen</h2>
		</div>
	</div>

	<div id="container">

		<!-- <input class="add button" type="button" value="Add Kategorie"
			onclick="window.location.href='addForom'; return false;" /> -->

		<!--  addlink with customer id -->
		<c:url var="addLink" value="/group/addForm">
			<c:param name="categoryId" value="${categoryId}"></c:param>
		</c:url>

		<!--  backToCategoryLink with category id -->
		<c:url var="backToCategoryLink" value="/category/getAll">
		</c:url>


		<table>
			<tr>
				<th>Titel</th>
				<th>CategoryId</th>
				<th><a href="${addLink}">Add</a></th>
			</tr>

			<c:forEach var="group" items="${groups}">

				<!--  updatelink with category id -->
				<c:url var="updateLink" value="/group/updateForm">
					<c:param name="groupId" value="${group.id}"></c:param>
					<c:param name="categoryId" value="${categoryId}"></c:param>
				</c:url>
				<!--  deletelink with category id -->
				<c:url var="deleteLink" value="/group/delete">
					<c:param name="groupId" value="${group.id}"></c:param>
					<c:param name="categoryId" value="${categoryId}"></c:param>
				</c:url>
				<!--  showlink with category id -->
				<c:url var="showLink" value="/bundle/show">
					<c:param name="groupId" value="${group.id}"></c:param>
					<c:param name="categoryId" value="${categoryId}"></c:param>
				</c:url>

				<tr>
					<td>${group.title}</td>
					<td>${group.categoryId}</td>
					<td><a href="${showLink}">Show</a> | <a href="${updateLink}">Update</a>
						| <a href="${deleteLink}"
						onClick="if(!(confirm('Are you sure you want to delete this group?'))) return false">Delete</a></td>
				</tr>
			</c:forEach>
		</table>
		<a href="${backToCategoryLink}">Back to Category</a>
	</div>
</body>
</html>