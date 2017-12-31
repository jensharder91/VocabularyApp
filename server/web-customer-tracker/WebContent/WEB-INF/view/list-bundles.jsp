<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html>
<head>
<title>Bundle List</title>
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/style.css" />
<%-- <link href="<c:url value='/resources/css/style.css' />" rel="stylesheet">
</head> --%>
<body>

	<div id="wrapper">
		<div id="header">
			<h2>Bundle List</h2>
		</div>
	</div>

	<div id="container">

		<!--  addlink with customer id -->
		<c:url var="addLink" value="/bundle/addForm">
			<c:param name="groupId" value="${groupId}"></c:param>
		</c:url>

		<!--  backToGroupLink with category id -->
		<c:url var="backToGroupLink" value="/bundle/back">
			<c:param name="groupId" value="${groupId}"></c:param>
		</c:url>


		<table>
			<tr>
				<th>Titel</th>
				<th>GroupId</th>
				<th><a href="${addLink}">Add new Bundle</a></th>
			</tr>

			<c:forEach var="bundle" items="${bundles}">

				<!--  updatelink with category id -->
				<c:url var="updateLink" value="/bundle/updateForm">
					<c:param name="bundleId" value="${bundle.id}"></c:param>
				</c:url>
				<!--  deletelink with category id -->
				<c:url var="deleteLink" value="/bundle/delete">
					<c:param name="bundleId" value="${bundle.id}"></c:param>
					<c:param name="groupId" value="${groupId}"></c:param>
				</c:url>
				<!--  showlink with category id -->
				<c:url var="showLink" value="/card/show">
					<c:param name="bundleId" value="${bundle.id}"></c:param>
				</c:url>

				<tr>
					<td>${bundle.title}</td>
					<td>${bundle.groupId}</td>
					<td><a href="${showLink}">Show</a> | <a href="${updateLink}">Update</a>
						| <a href="${deleteLink}"
						onClick="if(!(confirm('Are you sure you want to delete this bundle?'))) return false">Delete</a></td>
				</tr>
			</c:forEach>
		</table>
		<a href="${backToGroupLink}">Back to Group</a>
	</div>
</body>
</html>