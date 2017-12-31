<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<!DOCTYPE html>
<html>
<head>
<title><c:choose>
		<c:when test="${group.id=='0'}">
					Create new Group
				</c:when>
		<c:otherwise>
					Update Group
				</c:otherwise>
	</c:choose></title>
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/style.css" />
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/add-customer-style.css" />
<%-- <link href="<c:url value='/resources/css/style.css' />" rel="stylesheet">
</head> --%>
<body>

	<div id="wrapper">
		<div id="header">
			<c:choose>
				<c:when test="${group.id=='0'}">
					<h2>Create new Group</h2>
				</c:when>
				<c:otherwise>
					<h2>Update Group</h2>
				</c:otherwise>
			</c:choose>
		</div>
	</div>

	<div id="container">
		<form:form action="save" modelAttribute="group" method="POST">

			<!-- important, to map this customer to the right customer (while updating) -->
			<form:hidden path="id" />
			<form:hidden path="categoryId" />
			<%-- <form:hidden path="categoryId" /> --%>
			<!-- <input name="categoryId" type="hidden"/> -->

			<table>
				<tbody>
					<tr>
						<td><label>Title:</label></td>
						<td><form:input path="title" /></td>
					</tr>
					<tr>
						<td><label></label></td>
						<td><input type="submit" value="Save" class="save" /></td>
					</tr>
				</tbody>
			</table>
		</form:form>

		<!--  backToGroupsLink with category id -->
		<c:url var="backToGroupsLink" value="/group/show">
			<c:param name="categoryId" value="${group.categoryId}"></c:param>
		</c:url>

		<div style="">
			<a href="${backToGroupsLink}">Back to List</a>
		</div>
	</div>

</body>
</html>