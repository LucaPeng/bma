## BMA (Branch Management Abstract)

This is used to manage your git branches automatically and follow some specs.

### Branch Specs

#### Main Branches

main branches are used to deploy, which are not editable. You can only merge to these branches, solve conflict and push.

* master: master
* qa: qa
* dev: dev
* stage: stage
* beta: beta

what's more, you can config their truth name through 

`setConfig('branch', {dev: 'develop'})`

for example.

#### develop Branches prefix

* feature
* bugfix
* hotfix
* custom

each develop branch is prefixed with sepcified flag. your can config the branch-prefix through 

`setConfig('branchPrefix', {feature: 'feature/TASK-'})`

### Branch Manage

#### newBranch

```
  <boolean> newBranch(type, id, config)

  desc: create a new develop branch for specified type
  params:
    type: branch type to create
    id: branch id or desc to specify the task
    config:
      silence: set true to disconsole step info
```

#### mergeMasterToBranch

```
  <boolean> mergeMasterToBranch(branchName, config)

  desc: merge master to specified branch
  params:
    branchName: targetBranchName
    config:
      silence: set true to disconsole step info
```

#### mergeToMainBrach

```
  <boolean> mergeToMainBrach(branchName, mainBranch, config)

  desc: merge specified branch to a main branch
  params:
    branchName: target Branch Name
    mainBranch: main branch type, configured in conf
    config:
      mergeMaster: merge Master to branch before merge action
      forceEnvBranch: specify mainBranchName
      silence: set true to disconsole step info
```