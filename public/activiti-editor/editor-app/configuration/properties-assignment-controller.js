/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

var APPLY_USER = {
  id: '${applyUserId}',
  nickname: '发起人',
  username: '-',
  departName: '-'
}

var CUSTOM_EXPRESSION = 'customExpression'

function getHeaders (tokenKey) {
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  var token = EDITOR.UTIL.getParameterByName('token')
  token = token && token.replace(/^"|"$/g, '')
  headers[tokenKey] = token
  return headers
}

/*
 * Assignment
 */
var KisBpmAssignmentCtrl = ['$scope', '$modal', function ($scope, $modal) {
  // Config for the modal window
  var opts = {
    template: 'editor-app/configuration/properties/assignment-popup.html?version=' + Date.now(),
    scope: $scope
  }

  // Open the dialog
  $modal(opts)
}]

var KisBpmAssignmentPopupCtrl = ['$scope', '$modal', '$http', function ($scope, $modal, $http) {
  var headers = getHeaders($scope.config.token)

  $scope.customExpression = CUSTOM_EXPRESSION
  /**
   * 打开选择用户模态框
   *
   * @param type {string} assignee、candidateUsers
   */
  $scope.choseAssignment = function (type) {
    $scope.choseAssignmentType = type
    $modal({
      template: 'editor-app/configuration/properties/assignment-candidateUser.html?version=' + Date.now(),
      scope: $scope
    })
  }

  /**
   * 打开选择角色模态框
   *
   */
  $scope.choseCandidateGroups = function () {
    $modal({
      template: 'editor-app/configuration/properties/assignment-candidateGroup.html?version=' + Date.now(),
      scope: $scope
    })
  }

  // 设置代理人
  $scope.$on('setAssignee', function (event, choseCandidateUser) {
    if (choseCandidateUser.length) {
      $scope.assignment.assignee = choseCandidateUser[0].id
      $scope.assignment.displayAssignee = choseCandidateUser[0]
    } else {
      $scope.removeAssignee()
    }
  })

  // 设置候选人（签收人）
  $scope.$on('setCandidateUsers', function (event, choseCandidateUserArray) {
    var oldDisplayCandidateUsers = $scope.assignment.displayCandidateUsers
    var oldCandidateUsers = $scope.assignment.candidateUsers

    $scope.assignment.candidateUsers = []
    for (var i = 0, arrayLength = choseCandidateUserArray.length; i < arrayLength; i++) {
      // 设置value
      $scope.assignment.candidateUsers.push({ value: choseCandidateUserArray[i].id })
    }
    $scope.assignment.displayCandidateUsers = choseCandidateUserArray

    // 添加自定义表达式的候选人
    oldDisplayCandidateUsers.forEach(function (user, index) {
      if (user.nickname === CUSTOM_EXPRESSION) {
        $scope.assignment.candidateUsers.push({ value: oldCandidateUsers[index].value })
        $scope.assignment.displayCandidateUsers.push(user)
      }
    })
  })

  // 设置候选角色
  $scope.$on('setCandidateGroups', function (event, choseCandidateGroupArray) {
    var oldDisplayCandidateGroups = $scope.assignment.displayCandidateGroups
    var oldCandidateGroups = $scope.assignment.candidateGroups

    $scope.assignment.candidateGroups = []
    for (var i = 0, arrayLength = choseCandidateGroupArray.length; i < arrayLength; i++) {
      // 设置value
      $scope.assignment.candidateGroups.push({ value: choseCandidateGroupArray[i].id })
    }
    $scope.assignment.displayCandidateGroups = choseCandidateGroupArray
    // 添加自定义表达式的候选人
    oldDisplayCandidateGroups.forEach(function (group, index) {
      if (group.name === CUSTOM_EXPRESSION) {
        $scope.assignment.candidateGroups.push({ value: oldCandidateGroups[index].value })
        $scope.assignment.displayCandidateGroups.push(group)
      }
    })
  })

  // Put json representing assignment on scope
  if ($scope.property.value !== undefined && $scope.property.value !== null &&
    $scope.property.value.assignment !== undefined &&
    $scope.property.value.assignment !== null) {
    $scope.assignment = $scope.property.value.assignment
  } else {
    $scope.assignment = {}
  }

  if ($scope.assignment.candidateUsers == undefined || $scope.assignment.candidateUsers.length == 0) {
    $scope.assignment.candidateUsers = [{ value: '' }]
  }

  // 移除代理人
  $scope.removeAssignee = function () {
    $scope.assignment.assignee = null
    $scope.assignment.displayAssignee = null
  }

  /**
   * 设置为发起人
   */
  $scope.setApplyUserId = function () {
    $scope.assignment.candidateUsers = [{ value: APPLY_USER.id }]
    $scope.assignment.displayCandidateUsers = [APPLY_USER]
  }

  // 添加候选人
  $scope.addCandidateUser = function () {
    $scope.assignment.candidateUsers.push({ value: '' })
    $scope.assignment.displayCandidateUsers.push({
      id: '',
      username: CUSTOM_EXPRESSION,
      nickname: CUSTOM_EXPRESSION,
      departName: CUSTOM_EXPRESSION
    })
  }

  // 移除候选人
  $scope.removeCandidateUserValue = function (index) {
    $scope.assignment.candidateUsers.splice(index, 1)
    $scope.assignment.displayCandidateUsers.splice(index, 1)
  }

  // 移除全部候选人
  $scope.removeAllCandidateUserValue = function () {
    $scope.assignment.candidateUsers = []
    $scope.assignment.displayCandidateUsers = []
  }

  if ($scope.assignment.candidateGroups == undefined || $scope.assignment.candidateGroups.length == 0) {
    $scope.assignment.candidateGroups = [{ value: '' }]
  }

  // 添加候选角色
  $scope.addCandidateGroups = function () {
    $scope.assignment.candidateGroups.push({ value: '' })
    $scope.assignment.displayCandidateGroups.push({
      id: '',
      name: CUSTOM_EXPRESSION,
      code: CUSTOM_EXPRESSION
    })
  }

  // 移除候选角色
  $scope.removeCandidateGroupValue = function (index) {
    $scope.assignment.candidateGroups.splice(index, 1)
    $scope.assignment.displayCandidateGroups.splice(index, 1)
  }

  // 移除全部候选角色
  $scope.removeAllCandidateGroupValue = function () {
    $scope.assignment.candidateGroups = []
    $scope.assignment.displayCandidateGroups = []
  }

  $scope.save = function () {
    $scope.property.value = {}
    handleAssignmentInput($scope)
    $scope.property.value.assignment = $scope.assignment

    $scope.updatePropertyInModel($scope.property)
    $scope.close()
  }

  // 关闭模态框
  $scope.close = function () {
    handleAssignmentInput($scope)
    $scope.property.mode = 'read'
    $scope.$hide()
  }

  $scope.assignment.displayCandidateGroups = []
  $scope.assignment.displayCandidateUsers = []
  $scope.assignment.displayAssignee = null

  var handleAssignmentInput = function ($scope) {
    if ($scope.assignment.candidateUsers) {
      var emptyUsers = true
      var toRemoveIndexes = []
      for (var i = 0; i < $scope.assignment.candidateUsers.length; i++) {
        if ($scope.assignment.candidateUsers[i].value != '') {
          emptyUsers = false
        } else {
          toRemoveIndexes[toRemoveIndexes.length] = i
        }
      }

      for (var i = 0; i < toRemoveIndexes.length; i++) {
        $scope.assignment.candidateUsers.splice(toRemoveIndexes[i], 1)
      }

      if (emptyUsers) {
        $scope.assignment.candidateUsers = undefined
      }
    }

    if ($scope.assignment.candidateGroups) {
      var emptyGroups = true
      var toRemoveIndexes = []
      for (var i = 0; i < $scope.assignment.candidateGroups.length; i++) {
        if ($scope.assignment.candidateGroups[i].value != '') {
          emptyGroups = false
        } else {
          toRemoveIndexes[toRemoveIndexes.length] = i
        }
      }

      for (var i = 0; i < toRemoveIndexes.length; i++) {
        $scope.assignment.candidateGroups.splice(toRemoveIndexes[i], 1)
      }

      if (emptyGroups) {
        $scope.assignment.candidateGroups = undefined
      }
    }
  }

  /**
   * 查询角色&用户详情用以显示
   */
  $scope.load = function () {
    function findData (data, key, id) {
      var result = null
      data.forEach(function (obj) {
        if (obj[key] === id) {
          result = obj
        }
      })
      return result
    }

    /**
     * 加载候选人
     *
     * @param type {string} assignee、candidateUsers
     * @param candidateUsers {string} 用户id
     */
    const loadCandidateUsers = function (type, candidateUsers) {
      if (candidateUsers === '${applyUserId}') {
        if (type === 'assignee') {
          $scope.assignment.displayAssignee = APPLY_USER
        } else {
          $scope.assignment.displayCandidateUsers = [APPLY_USER]
        }
      } else {
        $http({
          method: 'get',
          headers: headers,
          url: ACTIVITI.CONFIG.contextRoot + '/auth/sys/user/users/' + candidateUsers,
        }).success(function (res, status, headers, config) {
          if (res.data) {
            if (type === 'assignee') {
              if (res.data.data && res.data.data.length) {
                $scope.assignment.displayAssignee = res.data.data[0]
              } else {
                $scope.assignment.displayAssignee = {
                  id: '',
                  username: CUSTOM_EXPRESSION,
                  nickname: CUSTOM_EXPRESSION,
                  departName: CUSTOM_EXPRESSION
                }
              }
            } else {
              $scope.assignment.candidateUsers.forEach(function (object) {
                var resultUser = findData(res.data.data, 'id', object.value)
                if (resultUser) {
                  $scope.assignment.displayCandidateUsers.push(resultUser)
                } else {
                  $scope.assignment.displayCandidateUsers.push({
                    id: '',
                    username: CUSTOM_EXPRESSION,
                    nickname: CUSTOM_EXPRESSION,
                    departName: CUSTOM_EXPRESSION
                  })
                }
              })
            }
          }
        }).error(function (data, status, headers, config) {
        })
      }
    }

    // 加载候选组
    const loadCandidateGroups = function () {
      var candidateGroups = []
      $scope.assignment.candidateGroups.forEach(function (object) {
        candidateGroups.push(object.value)
      })

      $http({
        method: 'get',
        headers: headers,
        url: ACTIVITI.CONFIG.contextRoot + '/auth/sys/role/role',
        params: {
          isSelect: false,
          id: candidateGroups.join(',')
        }
      }).success(function (res, status, headers, config) {
        $scope.assignment.displayCandidateGroups = []
        if (res.data) {
          $scope.assignment.candidateGroups.forEach(function (object) {
            var resultGroup = findData(res.data, 'id', object.value)
            if (resultGroup) {
              $scope.assignment.displayCandidateGroups.push(resultGroup)
            } else {
              $scope.assignment.displayCandidateGroups.push({
                id: object.value,
                name: CUSTOM_EXPRESSION,
                code: CUSTOM_EXPRESSION
              })
            }
          })
        }
      }).error(function (data, status, headers, config) {
      })
    }
    if ($scope.assignment.assignee) {
      loadCandidateUsers('assignee', $scope.assignment.assignee)
    }
    if ($scope.assignment.candidateUsers.length) {
      var candidateUsers = []
      $scope.assignment.candidateUsers.forEach(function (object) {
        candidateUsers.push(object.value)
      })
      loadCandidateUsers('candidateUsers', candidateUsers.join(','))
    }

    if ($scope.assignment.candidateGroups.length) {
      loadCandidateGroups()
    }
  }
}]

/**
 * 用户选择模态框的控制器
 *
 * @type {(string|(function(...[*]=)))[]}
 */
var KisBpmChoseAssignmentCtrl = ['$scope', '$http', function ($scope, $http) {
  var headers = getHeaders($scope.config.token)

  $scope.query = {
    deptId: null,
    roleId: null,
    keywords: null
  }
  /**
   * 查询部门
   */
  $scope.selectDepartments = function () {
    $http({
      method: 'get',
      headers: headers,
      url: ACTIVITI.CONFIG.contextRoot + '/auth/sys/dept/departments'
    }).success(function (res, status, headers, config) {
      $scope.candidateDepartments = res.data
    }).error(function (data, status, headers, config) {
    })
  }

  // $scope.selectRoles = function () {
  //   $http({
  //     method: 'get',
  //     headers: headers,
  //     url: ACTIVITI.CONFIG.contextRoot + '/auth/sys/role/role',
  //     params: {
  //       isSelect: true
  //     }
  //   }).success(function (res, status, headers, config) {
  //     $scope.candidateGroups = res.data
  //   }).error(function (data, status, headers, config) {
  //   })
  // }

  /**
   * 查询用户
   */
  $scope.selectUsers = function () {
    $http({
      method: 'get',
      headers: headers,
      url: ACTIVITI.CONFIG.contextRoot + '/auth/sys/user/search',
      params: {
        isSelect: true,
        deptId: $scope.query.deptId,
        // roles: $scope.query.roleId,
        keywords: $scope.query.keywords,
        'page.size': 10,
        'page.current': 1
      }
    }).success(function (res, status, headers, config) {
      $scope.candidateUsers = res.data.records

      for (var i = 0, arrayLength = $scope.candidateUsers.length; i < arrayLength; i++) {
        if ($scope.choseAssignmentType === 'assignee') {
          if ($scope.assignment.assignee === $scope.candidateUsers[i].id) {
            $scope.candidateUsers[i].selected = true
            return false
          }
        } else {
          $scope.assignment.displayCandidateUsers.forEach(function (hasChose) {
            if (hasChose.id === $scope.candidateUsers[i].id) {
              $scope.candidateUsers[i].selected = true
              return false
            }
          })
        }
      }
    }).error(function (data, status, headers, config) {
    })
  }

  $scope.selectDepartments()
  // $scope.selectRoles()

  // Close button handler
  $scope.close = function () {
    $scope.$hide()
  }

  // Save Data
  $scope.save = function () {
    var choseCandidateUsers = $scope.candidateUsers
    var choseCandidateUserArray = []
    for (var i = 0; i < choseCandidateUsers.length; i++) {
      if (choseCandidateUsers[i].selected && choseCandidateUsers[i].selected !== 'false') {
        choseCandidateUserArray.push(choseCandidateUsers[i])
      }
    }
    // 子窗口向父窗口传输数据

    $scope.$emit($scope.choseAssignmentType === 'assignee' ? 'setAssignee' : 'setCandidateUsers', choseCandidateUserArray)
    $scope.close()
  }

  $scope.selectAll = function ($event) {
    var checkbox = $event.target
    var choseAssignees = $scope.candidateUsers
    for (var i = 0; i < choseAssignees.length; i++) {
      if (checkbox.checked) {
        choseAssignees[i].selected = true
      } else {
        choseAssignees[i].selected = false
      }
    }
    $scope.candidateUsers = choseAssignees
  }
}]

// 组选择模态框的控制器
var KisBpmChoseCandidateGroupsCtrl = ['$scope', '$http', function ($scope, $http) {
  var headers = getHeaders($scope.config.token)
  $http({
    method: 'get',
    headers: headers,
    url: ACTIVITI.CONFIG.contextRoot + '/auth/sys/role/role',
    params: {
      isSelect: true
    }
  }).success(function (res, status, headers, config) {
    $scope.candidateGroups = res.data
    for (var i = 0, arrayLength = $scope.candidateGroups.length; i < arrayLength; i++) {
      $scope.assignment.displayCandidateGroups.forEach(function (hasChose) {
        if (hasChose.id === $scope.candidateGroups[i].id) {
          $scope.candidateGroups[i].selected = true
          return false
        }
      })
    }
  }).error(function (data, status, headers, config) {
  })

  // 关闭按钮的点击事件
  $scope.close = function () {
    $scope.$hide()
  }

  // 保存按钮的点击事件
  $scope.save = function () {
    var choseCandidateGroups = $scope.candidateGroups
    var choseCandidateGroupArray = []
    for (var i = 0; i < choseCandidateGroups.length; i++) {
      if (choseCandidateGroups[i].selected && choseCandidateGroups[i].selected !== 'false') {
        choseCandidateGroupArray.push(choseCandidateGroups[i])
      }
    }
    // 子窗口向父窗口传输数据
    $scope.$emit('setCandidateGroups', choseCandidateGroupArray)
    $scope.close()
  }

  // 全选
  $scope.selectAll = function ($event) {
    var checkbox = $event.target
    var candidateGroups = $scope.candidateGroups
    for (var i = 0; i < candidateGroups.length; i++) {
      if (checkbox.checked) {
        candidateGroups[i].selected = true
      } else {
        candidateGroups[i].selected = false
      }
    }
    $scope.candidateGroups = candidateGroups
  }
}]
