#!/bin/bash

cnt=`aws ec2 describe-instances --filters "Name=tag:Name,Values=$1" | grep $1 | wc -l`
if (( $cnt > 0 ))
then
        echo "instance already exists with such a Name tag: $1"
        exit 1
fi

id=`aws ec2 run-instances --image-id ami-d732f0b7 --count 1 --instance-type t2.micro --key-name render_automatic --security-group-ids sg-abfcf8cd --query 'Instances[0].InstanceId'`
if (( $? != 0 ))
then
        echo "failed to create instance"
        exit 1
fi
id="${id%\"}"
id="${id#\"}"

ip=`aws ec2 describe-instances --instance-ids $id --query 'Reservations[0].Instances[0].PublicIpAddress'`
if (( $? != 0 ))
then
        echo "failed to retrieve IP of instance $id, error"
        exit 1
fi
ip="${ip%\"}"
ip="${ip#\"}"

echo "created an instance $id with public IP address $ip"

aws ec2 create-tags --resources $id --tags Key=Name,Value=$1

if (( $? != 0 ))
then
        echo "failed to alter tag, error $err"
        exit 1
fi

echo "assigned name $1 to instance $id"

while [ "$status" != "running" ]; do
        status==`aws ec2 describe-instances --instance-ids $id --query 'Reservations[0].Instances[0].State.Name' 2>&1`
        status=`echo $status | sed -e 's/=//g' | sed -e 's/^"//' -e 's/"$//'`
        echo "state : $status"
        sleep 3s
done

echo "finished spinup"

pem="key.pem"
login="ubuntu"
server=$ip

while ! nc -w 3 -z $ip 22; do
  sleep 3s
  echo "so far SSH not available"
done

echo -e "Try to connect to server first\n"

chmod 600 $pem

function getfullpath {
        oldpath=`pwd`
        cd `dirname $1`
        local res=`pwd`
        cd $oldpath
        file_name=`basename $1`
        res="$res/$file_name"
        local __resultvar=$2
        eval $__resultvar=$res
}

getfullpath $pem absolute_pem

function invoke {
        ssh_command="ssh  -o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectTimeout=50 -i $absolute_pem -l $login $server $1 2>&1"
        echo -e "$ssh_command\n"

        status=$($ssh_command)
        retcode=$?

        if [[ $retcode == 0 ]] ; then
                echo "OK"
        elif [[ $status == "Permission denied"* ]] ; then
                echo -e "Login failed\n"
                exit 1
        else
                echo -e "Connection or command failed: $status, retcode $retcode \n"
                if [[ $2 == 1 ]] ; then
			echo -e "Failed but not exiting as second param set to 1"
			return 1
		else
			exit 1
		fi
        fi
}

function upload {
        getfullpath $1 upload_path
        ssh_command="scp -o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectTimeout=5 -i $absolute_pem $upload_path $login@$server:$2"
        echo -e "$ssh_command";

        status=$($ssh_command)

        if [[ $status == `` ]] ; then
                echo "OK"
        elif [[ $status == "Permission denied"* ]] ; then
                echo -e "Login failed\n"
                exit 1
        else
                echo -e "Connection failed: $status\n"
                exit 1
        fi
}

invoke echo ok
