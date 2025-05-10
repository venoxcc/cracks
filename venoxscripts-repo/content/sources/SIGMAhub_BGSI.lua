--// Paste your source here
  local ReplicatedStorage = game:GetService('ReplicatedStorage')
local Players = game:GetService('Players')
local UserInputService = game:GetService('UserInputService')
local ReplicatedFirst = game:GetService('ReplicatedFirst')
local TweenService = game:GetService('TweenService')

local LocalPlayer = Players.LocalPlayer 
local Humanoid = LocalPlayer.Character.Humanoid 

local Shared = ReplicatedStorage.Shared 
local Remotes = ReplicatedStorage.Remotes
local Framework = Shared.Framework 
local Data = Shared.Data
local Network = Framework.Network

local EggsData = require(ReplicatedStorage.Shared.Data.Eggs)
local PlayerData = require(ReplicatedStorage.Client.Framework.Services.LocalData)

local GameRemotes = Network.Remote 

local GameEvent = GameRemotes.Event 
local GameFunction = GameRemotes.Function

local CollectPickup = Remotes.Pickups.CollectPickup

local function GetPickupFolder() 
    local Folder = nil 
    for i,v in next, workspace.Rendered:GetChildren() do 
        if v.Name == 'Chunker' then 
            if v:FindFirstChildWhichIsA('Model') and #v:FindFirstChildWhichIsA('Model').Name == 36 then
                Folder = v 
                break 
            end  
        end 
    end 
    return Folder 
end 

local function Teleport(Pos)
    local Time = (LocalPlayer.Character.HumanoidRootPart.Position - Pos).magnitude/Humanoid.WalkSpeed 
    TweenService:Create(game.Players.LocalPlayer.Character.HumanoidRootPart, TweenInfo.new(Time), {CFrame = CFrame.new(Pos)}):Play() 
end 

local function GetEggFolder() 
	local Folder = nil 
	local Break = false 

	for i,v in next, workspace.Rendered:GetChildren() do 
		if v.Name == 'Chunker' then
			if Break then break end 
			table.foreach(v:GetChildren(), function(_,PossibleEgg)
				if PossibleEgg:IsA('Model') and PossibleEgg.Name:find(' Egg') then 
					Folder = v 
					Break = true 
				end 
			end)
		end 
	end 
	
	return Folder
end 

local CountEggFolder = 0 
local FirstEggFolder = nil 
local CanGetEggFolder = true 
local function GetClosestEgg() 
	local ClosestEgg = nil 
	local MaxDistance = math.huge 
	local EggFolder = nil 

	if CanGetEggFolder then 
		EggFolder = GetEggFolder() 
		if FirstEggFolder ~= nil and FirstEggFolder ~= EggFolder then 
			CountEggFolder = 0
		end 
	else 
		EggFolder = FirstEggFolder 
	end 

	CountEggFolder = CountEggFolder + 1 
	if CountEggFolder == 3 and FirstEggFolder == EggFolder then 
		CanGetEggFolder = false 
	elseif CountEggFolder == 7 then 
		CanGetEggFolder = true 
		CountEggFolder = 0 
	end 

	FirstEggFolder = EggFolder

	for i,v in next, EggFolder:GetChildren() do 
		if v:IsA('Model') and v.Name:find(' Egg') then 
			local Distance = (LocalPlayer.Character.HumanoidRootPart.Position - v:FindFirstChildWhichIsA('BasePart').Position).magnitude 
			if Distance < MaxDistance then 
				ClosestEgg = tostring(v)
				MaxDistance = Distance
			end 
		end 
	end 

	return ClosestEgg 
end 

local function GetTotalPotionsCount() 
	local TotalCount = 0
	local GetData = PlayerData:Get()
	for i,v in next, GetData.Potions do 
		TotalCount = TotalCount + v.Amount 
	end 
	return TotalCount, GetData.Potions
end 

local function GetPetsToShiny() 
    local Pets = {} 
	local PetsCount = 0
    local PetData = PlayerData:Get().Pets 
    for i,v in next, PetData do 
        if v.Amount ~= nil then 
            if v.Amount >= 12 then 
                Pets[v.Id] = v.Amount
				PetsCount = PetsCount + 1
            end 
        end 
    end 
    return Pets, PetsCount
end 

local Eggs = {} 
local EggLocations = {
    ['Rainbow Egg'] =  Vector3.new(-36.32263946533203, 15977.921875, 42.36994171142578),

}

for i,v in next, EggsData do 
    table.insert(Eggs, i)
end 

local Islands = {
    [1] = Vector3.new(7.779938220977783, 454.7569274902344, 154.869873046875),
    [2] = Vector3.new(15.46345329284668, 2686.095703125, -3.062727451324463),
    [3] = Vector3.new(-67.6795883178711, 6889.7919921875, 93.14334106445312),
    [4] = Vector3.new(14.114273071289062, 10165, 167.76483154296875), 
    [5] = Vector3.new(24.800094604492188, 15996.1083984375, -93.69257354736328)
}

local Orion = loadstring(game:HttpGet('https://raw.githubusercontent.com/jensonhirst/Orion/main/source'))()
local Window = Orion:MakeWindow({Name = 'Sigma Hub | BGS Infinity', HidePremium = true, SaveConfig = true, ConfigFolder = 'SigmaHub'})

print(GetClosestEgg())

local MainTab = Window:MakeTab({
    Name = 'Main',
    Icon = 'rbxassetid://4483345998',
    PremiumOnly = false 
}) do 
    local MainSection = MainTab:AddSection({Name = 'Main'}) do 
        MainSection:AddToggle({
            Name = 'Auto Farm',
            Default = false,
            Callback = function(t)
                _G.AutoBubble = t
            end,
        })

        MainSection:AddToggle({
            Name = 'Auto Sell',
            Default = false, 
            Callback = function(t)
                _G.AutoSell = t
            end, 
        })

        MainSection:AddToggle({
            Name = 'Auto Collect Pickups',
            Default = false, 
            Callback = function(t)
                _G.AutoCollectPickups = t
            end,
        })
    end 

    local OtherSection = MainTab:AddSection({Name = 'Other'}) do 
        OtherSection:AddToggle({
			Name = 'Auto Use Potions',
			Default = false, 
			Callback = function(t)
				_G.AutoPotions = t
			end 
		})
		OtherSection:AddToggle({
			Name = 'Auto Use Golden Orb',
			Default = false, 
			Callback = function(t)
				_G.AutoGoldenOrb = t
			end 
		})
		OtherSection:AddToggle({
            Name = 'Auto Open Giant Chest',
            Default = false, 
            Callback = function(t)
                _G.AutoOpenGiantChest = t
            end 
        })

        OtherSection:AddToggle({
            Name = 'Auto Open Void Chest',
            Default = false, 
            Callback = function(t)
                _G.AutoOpenVoidChest = t
            end, 
        })

        OtherSection:AddToggle({
            Name = 'Auto Open Mystery Gifts',
            Default = false, 
            Callback = function(t)
                _G.AutoUseMysteryGift = t
            end 
        })

        OtherSection:AddToggle({
            Name = 'Auto Spin Wheel',
            Default = false, 
            Callback = function(t)
                _G.AutoSpinWheel = t
            end 
        })

        OtherSection:AddToggle({
            Name = 'Auto Claim Time Rewards',
            Default = false, 
            Callback = function(t)
                _G.AutoClaimTimeRewards = t
            end 
        })

        OtherSection:AddToggle({
            Name = 'Auto Claim Season Rewards',
            Default = false, 
            Callback = function(t)
                _G.AutoClaimSeasonRewards = t
            end, 
        })
        OtherSection:AddToggle({
            Name = 'Auto Claim Free Wheel',
            Default = false, 
            Callback = function(t)
                _G.AutoClaimFreeSpin = t
            end 
        })
    end 
end 
local PetsTab = Window:MakeTab({
    Name = 'Pets',
    Icon = 'rbxassetid://4483345998',
    PremiumOnly = false 
}) do 
    local MainSection = PetsTab:AddSection({Name = 'Hatching'}) do 
        MainSection:AddToggle({
            Name = 'Auto Hatch', 
            Default = false, 
            Callback = function(t)
                _G.AutoHatch = t 
            end 
        })

        MainSection:AddToggle({
            Name = 'Multi Hatch',
            Default = false, 
            Callback = function(t)
                _G.MultiHatch = t 
            end 
        })

        MainSection:AddToggle({
            Name = 'Triple Hatch',
            Default = false, 
            Callback = function(t)
                _G.TripleHatch = t 
            end 
        })

        MainSection:AddToggle({
            Name = 'Closest Egg',
            Default = false, 
            Callback = function(t)
                _G.ClosestEgg = t 
            end 
        })

        MainSection:AddDropdown({
            Name = 'Select Egg',
            Default = nil, 
            Options = Eggs,
            Callback = function(t)
                _G.SelectedEgg = t
            end
        })
    end 
	local OtherSection = PetsTab:AddSection({Name = 'Other'}) do 
		OtherSection:AddToggle({
			Name = 'Auto Shiny Pets',
			Default = false, 
			Callback = function(t)
				_G.AutoShinyPets = t
			end 
		})
		OtherSection:AddToggle({
			Name = 'Auto Pet Mastery',
			Default = false, 
			Callback = function(t)
				_G.AutoPetMastery = t
			end 
		})
	end 
end 

local MiscTab = Window:MakeTab({
    Name = 'Misc',
    Icon = 'rbxassetid://4483345998',
    PremiumOnly = false 
}) do 
    local MainSection = MiscTab:AddSection({Name = 'Misc'}) do 
        MainSection:AddButton({
            Name = 'Unlock All Islands',
            Callback = function()
                for i,v in next, Islands do 
                    LocalPlayer.Character.HumanoidRootPart.CFrame = CFrame.new(v)
                    task.wait(.25)
                end 
            end 
        })

		MainSection:AddButton({
			Name = 'Instant Doggy Jump Rewards',
			Callback = function() 
				for i = 1, 3 do 
					GameEvent:FireServer('DoggyJumpWin', i)
					task.wait(.33)
				end 
			end,
		})

        MainSection:AddToggle({
            Name = 'Infinite Jump',
            Default = false, 
            Callback = function(t)
                _G.InfiniteJump = t
            end,
        })
    end 
end 

UserInputService.JumpRequest:Connect(function()
    if _G.InfiniteJump then 
        Humanoid:ChangeState('Jumping')
    end 
end)

task.spawn(function()
    while task.wait(.5) do 
        if _G.AutoSell then 
            GameEvent:FireServer('SellBubble')
        end 
    end 
end)

task.spawn(function()
    while task.wait(.75) do 
        if _G.AutoBubble then 
            GameEvent:FireServer('BlowBubble')
        end   
    end 
end)

local PickupFolder = GetPickupFolder()
task.spawn(function()
    while task.wait(2.5) do 
        if _G.AutoCollectPickups then 
            for i,v in next, PickupFolder:GetChildren() do 
                CollectPickup:FireServer(v.Name)
                task.wait(.05)
            end 
        end 
    end 
end)

task.spawn(function()
	while task.wait(5) do 
		local GetEgliblePets, PetsCount = GetPetsToShiny() 
		if _G.AutoShinyPets and PetsCount > 0 then 
			for Id,Amount in next, GetEgliblePets do 
				for i = 1, Amount//12 do 
					GameEvent:FireServer('MakePetShiny', Id)
					task.wait(0.33)
				end 
			end 
		end 
	end 
end)

task.spawn(function()
	while task.wait(.75) do 
		if _G.AutoPetMastery then 
			GameEvent:FireServer('UpgradeMastery', 'Pets')
		end 
	end 
end)

task.spawn(function()
    while task.wait(5) do 
        PickupFolder = GetPickupFolder()
    end 
end)

task.spawn(function()
    while task.wait(15) do 
        if _G.AutoClaimFreeSpin then 
            GameEvent:FireServer('ClaimFreeWheelSpin')
        end 
    end 
end)

task.spawn(function()
	while task.wait(7.5) do 
		local GetData = PlayerData:Get() 
		if _G.AutoGoldenOrb and GetData.Powerups['Golden Orb'] > 0 then 
			for i = 1, GetData.Powerups['Golden Orb'] do 
				GameEvent:FireServer('UseGoldenOrb')
				task.wait(.15)
			end 
		end 
	end 
end)

task.spawn(function()
	while task.wait(3) do 
		local PotionsCount, Potions = GetTotalPotionsCount()

		if _G.AutoPotions and PotionsCount > 0 then 
			for i,v in next, Potions do 
				for i = 1, v.Amount do 
					GameEvent:FireServer('UsePotion', v.Name, v.Level)
					task.wait(.066)
				end 
			end 
		end 
	end 
end) 

task.spawn(function()
    while task.wait(15) do 
        if _G.AutoClaimTimeRewards then 
            for i = 1, 9 do 
                GameFunction:InvokeServer('ClaimPlaytime', i)
                task.wait(.25)
            end 
        end 
    end 
end)

task.spawn(function()
    while task.wait(.35) do 
		local GetData = PlayerData:Get()
        if _G.AutoUseMysteryGift and GetData.Powerups['Mystery Box'] > 0 then 
            GameEvent:FireServer('UseGift', 'Mystery Box', 1)
        end 
    end 
end)

workspace.Rendered.Gifts.ChildAdded:Connect(function(Gift)
	local GiftLength = #Gift.Name 
	if GiftLength == 36 and _G.AutoUseMysteryGift then 
		GameEvent:FireServer('ClaimGift', Gift.Name)
		Gift:Destroy()
	end 
end)

task.spawn(function()
    while task.wait(.75) do 
		local GetData = PlayerData:Get()
        if _G.AutoSpinWheel and GetData.Powerups['Spin Ticket'] > 0 then 
            GameFunction:InvokeServer('WheelSpin')
        end 
    end 
end)

task.spawn(function()
    while task.wait(.75) do 
        if _G.AutoClaimSeasonRewards then 
            GameEvent:FireServer('ClaimSeason')
        end 
    end 
end)

task.spawn(function()
    while task.wait(.5) do 
        if _G.AutoHatch and (_G.SelectedEgg or _G.ClosestEgg) then 
            GameEvent:FireServer('HatchEgg', _G.ClosestEgg and GetClosestEgg() or _G.SelectedEgg, _G.TripleHatch and 3 or _G.MultiHatch and 2 or 1)
        end  
    end 
end)

task.spawn(function()
    while task.wait() do 
        if _G.AutoOpenVoidChest then 
            GameEvent:FireServer('ClaimChest', 'Void Chest')
        end 
    end 
end)

task.spawn(function()
    while task.wait(15) do 
        if _G.AutoOpenGiantChest then 
            GameEvent:FireServer('ClaimChest', 'Giant Chest')
        end 
    end 
end)

Orion:Init()
 
