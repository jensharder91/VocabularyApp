<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<!DOCTYPE html>
<html>
<head>
<title><c:choose>
		<c:when test="${bundle.id=='0'}">
					Create new Bundle
				</c:when>
		<c:otherwise>
					Update Bundle
				</c:otherwise>
	</c:choose></title>
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/style.css" />
<link type="text/css" rel="stylesheet"
	href="${pageContext.request.contextPath}/resources/css/add-customer-style.css" />
<%-- <link href="<c:url value='/resources/css/style.css' />" rel="stylesheet">
</head> --%>
<body>
	<!--  backToBundleLink with category id -->
	<c:url var="backToGroupsLink" value="/bundle/show">
		<c:param name="groupId" value="${bundle.groupId}"></c:param>
	</c:url>

	<div id="wrapper">
		<div id="header">
			<c:choose>
				<c:when test="${bundle.id=='0'}">
					<h2>
						<a class="mybutton" href="${backToGroupsLink}">&#171; Back to List</a> Create new
						Bundle
					</h2>
				</c:when>
				<c:otherwise>
					<h2>
						<a class="mybutton" href="${backToGroupsLink}">&#171; Back to List</a> Update
						Bundle
					</h2>
				</c:otherwise>
			</c:choose>
		</div>
	</div>

	<div id="container">
		<form:form action="save" modelAttribute="bundle" method="POST">

			<!-- important, to map this customer to the right customer (while updating) -->
			<form:hidden path="id" />
			<form:hidden path="groupId" />
			<%-- <form:hidden path="categoryId" /> --%>
			<%-- <input name="groupId" type="hidden" value="${groupId}"/> --%>

			<table>
				<tbody>
					<tr>
						<td><label>Title:</label></td>
						<td><form:input path="title" /></td>
					</tr>
					<tr>
						<td><label></label></td>
						<td><input type="submit" value="Save" class="mybutton" /></td>
					</tr>
				</tbody>
			</table>
		</form:form>


	</div>

</body>
</html>